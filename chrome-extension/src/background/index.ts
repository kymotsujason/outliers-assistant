interface CacheEntry {
  data: string;
  timestamp: number;
}

const resultCache: { [key: string]: CacheEntry } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const API_TIMEOUT = 10000; // 10 seconds timeout for API requests
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second delay between retries
const TAB_LOAD_TIMEOUT = 15000; // 15 seconds timeout for tab loading

// Branded type for tab IDs to ensure type safety
type TabId = number & { readonly __brand: unique symbol };

let createdTabId: TabId | null = null;
let isCreatingTab = false;

const getOutlierCookies = async (): Promise<{ [key: string]: string }> => {
  try {
    console.log('Fetching cookies for Outlier domain');

    const cookies = await chrome.cookies.getAll({ domain: 'outlier.ai' });
    console.log(`Retrieved ${cookies.length} cookies from Outlier domain`);

    const cookieObj: { [key: string]: string } = {};
    cookies.forEach(cookie => {
      cookieObj[cookie.name] = cookie.value;
    });

    // Check for CSRF token (needed for API calls)
    if (!cookieObj._csrf) {
      throw new Error('CSRF cookie not found. Please log in to Outlier first.');
    }

    // Check for JWT token (site uses JWT for authentication, not session)
    if (!cookieObj._jwt) {
      throw new Error('Authentication cookie (JWT) not found. Please log in to Outlier first.');
    }

    return cookieObj;
  } catch (error) {
    console.error('Error retrieving cookies:', error);
    throw error;
  }
};

const isOutlierTab = (url: string | undefined): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'app.outlier.ai' ||
      urlObj.hostname === 'www.app.outlier.ai' ||
      urlObj.hostname.endsWith('.outlier.ai')
    );
  } catch {
    return url.includes('outlier.ai/');
  }
};

const waitForTabLoad = async (tabId: number): Promise<void> => {
  console.log(`Waiting for tab ${tabId} to complete loading...`);

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Tab loading timed out'));
    }, TAB_LOAD_TIMEOUT);

    const checkTabStatus = async () => {
      try {
        let tab: chrome.tabs.Tab | undefined;

        try {
          tab = await chrome.tabs.get(tabId);
        } catch (e) {
          clearTimeout(timeoutId);
          reject(new Error(`Tab ${tabId} not found: ${e instanceof Error ? e.message : String(e)}`));
          return;
        }

        if (!tab) {
          clearTimeout(timeoutId);
          reject(new Error(`Tab ${tabId} no longer exists`));
          return;
        }

        if (tab.status === 'complete' && isOutlierTab(tab.url)) {
          clearTimeout(timeoutId);
          console.log(`Tab ${tabId} loaded successfully`);
          resolve();
          return;
        }

        setTimeout(checkTabStatus, 200);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    };

    checkTabStatus();
  });
};

const createOutlierTab = async (): Promise<TabId> => {
  console.log('Creating new tab for Outlier site');

  if (isCreatingTab) {
    throw new Error('Already creating an Outlier tab');
  }

  isCreatingTab = true;

  try {
    const tab = await chrome.tabs.create({
      url: 'https://app.outlier.ai/',
      active: false,
    });

    if (!tab.id) {
      throw new Error('Failed to create tab (no ID returned)');
    }

    createdTabId = tab.id as TabId;
    console.log(`Created new tab with ID ${createdTabId}`);

    await waitForTabLoad(createdTabId);

    return createdTabId;
  } catch (error) {
    console.error('Error creating Outlier tab:', error);
    throw error;
  } finally {
    isCreatingTab = false;
  }
};

const cleanupTabIfNeeded = async (): Promise<void> => {
  const tabIdToClose = createdTabId;

  if (tabIdToClose !== null) {
    try {
      createdTabId = null;

      console.log(`Closing created tab ${tabIdToClose}`);
      await chrome.tabs.remove(tabIdToClose);
      console.log(`Tab ${tabIdToClose} closed successfully`);
    } catch (error) {
      console.error(`Error closing tab ${tabIdToClose}:`, error);
    }
  }
};

const findOrCreateOutlierTab = async (autoCreate = true): Promise<TabId> => {
  try {
    const tabs = await chrome.tabs.query({});
    const outlierTabs = tabs.filter(tab => isOutlierTab(tab.url) && tab.id !== undefined);

    if (outlierTabs.length > 0 && outlierTabs[0].id) {
      console.log(`Found existing Outlier tab: ${outlierTabs[0].id}`);
      return outlierTabs[0].id as TabId;
    }

    if (!autoCreate) {
      throw new Error('No Outlier tabs found and auto-create is disabled');
    }

    return createOutlierTab();
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('not allowed'))) {
      throw new Error('Missing tabs permission. Please check extension permissions.');
    }
    throw error;
  }
};

const activateTabForLogin = async (tabId: TabId): Promise<void> => {
  try {
    await chrome.tabs.update(tabId, { active: true });
    const tab = await chrome.tabs.get(tabId);
    if (tab.windowId) {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
  } catch (error) {
    console.error('Failed to activate tab for login:', error);
  }
};

const fetchUserData = async (retryCount = 0): Promise<string> => {
  try {
    if (retryCount > 0) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Waiting ${delay}ms before retry ${retryCount}`);
    }

    const cookieObj = await getOutlierCookies();

    console.log('Making API request to fetch user data');

    let fetchAborted = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchAborted = true;
      controller.abort();
      console.error('API request timed out');
    }, API_TIMEOUT);

    try {
      const response = await fetch('https://app.outlier.ai/internal/logged_in_user', {
        method: 'GET',
        headers: {
          'x-csrf-token': cookieObj._csrf,
          cookie: Object.entries(cookieObj)
            .map(([name, value]) => `${name}=${value}`)
            .join('; '),
        },
        credentials: 'include',
        signal: controller.signal,
      });

      if (!fetchAborted) {
        clearTimeout(timeoutId);
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('Not authenticated. Please log in to Outlier first.');
      } else if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.text();

      if (!data || data === '{}' || data === 'null') {
        throw new Error('No user data returned. Please ensure you are logged in to Outlier.');
      }

      console.log('Successfully retrieved user data from API');

      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof TypeError && fetchError.message.includes('network')) {
        throw new Error('Network error occurred. Please check your internet connection.');
      }

      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        throw new Error('API request timed out. Please try again later.');
      }

      throw fetchError;
    }
  } catch (error) {
    console.error(`Error fetching user data (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying API request... (${retryCount + 1}/${MAX_RETRIES})`);
      return fetchUserData(retryCount + 1);
    }

    return JSON.stringify({
      error: error instanceof Error ? error.message : String(error),
      errorCode: determineErrorCode(error),
    });
  }
};

const determineErrorCode = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'UNKNOWN_ERROR';
  }

  const errorMsg = error.message.toLowerCase();

  if (
    errorMsg.includes('log in') ||
    errorMsg.includes('logged in') ||
    errorMsg.includes('authentication') ||
    errorMsg.includes('authenticated') ||
    errorMsg.includes('session') ||
    errorMsg.includes('csrf')
  ) {
    return 'NOT_LOGGED_IN';
  }

  if (errorMsg.includes('network') || errorMsg.includes('connection')) {
    return 'NETWORK_ERROR';
  }

  if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
    return 'TIMEOUT';
  }

  return 'API_REQUEST_FAILED';
};

const getUserData = async (forceRefresh = false, autoCreateTab = true): Promise<string> => {
  const cacheKey = 'userData';
  const now = Date.now();

  if (!forceRefresh && resultCache[cacheKey] && now - resultCache[cacheKey].timestamp < CACHE_DURATION) {
    console.log('Returning cached user data');
    return resultCache[cacheKey].data;
  }

  try {
    let tabId: TabId;
    try {
      tabId = await findOrCreateOutlierTab(autoCreateTab);
    } catch (tabError) {
      console.error('Tab creation error:', tabError);
      return JSON.stringify({
        error: tabError instanceof Error ? tabError.message : String(tabError),
        errorCode:
          tabError instanceof Error && tabError.message.includes('permission') ? 'PERMISSION_ERROR' : 'TAB_ERROR',
      });
    }

    const result = await fetchUserData();

    const resultObj = JSON.parse(result);
    if (resultObj.error && resultObj.errorCode === 'NOT_LOGGED_IN') {
      await activateTabForLogin(tabId);
    }

    try {
      if (!resultObj.error || resultObj.errorCode !== 'NOT_LOGGED_IN') {
        await cleanupTabIfNeeded();
      }

      if (!resultObj.error) {
        resultCache[cacheKey] = {
          data: result,
          timestamp: now,
        };
      }

      return result;
    } catch (parseError) {
      console.error('Failed to parse result as JSON:', parseError);
      return JSON.stringify({
        error: 'Invalid data returned from API',
        errorCode: 'INVALID_JSON',
      });
    }
  } catch (error) {
    try {
      await cleanupTabIfNeeded();
    } catch (cleanupError) {
      console.error('Error during tab cleanup:', cleanupError);
    }

    console.error('Error retrieving user data:', error);

    let errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = determineErrorCode(error);

    if (errorCode === 'NOT_LOGGED_IN' && !errorMessage.includes('Please open')) {
      errorMessage = `${errorMessage} Please open https://app.outlier.ai/ in your browser and log in before using this extension.`;
    }

    return JSON.stringify({
      error: errorMessage,
      errorCode,
    });
  }
};

const clearCache = async (): Promise<void> => {
  Object.keys(resultCache).forEach(key => delete resultCache[key]);
  console.log('Cache cleared');
};

interface OutlierAssistantRequest {
  outlierassistant: string;
  forceRefresh?: boolean;
  autoCreateTab?: boolean;
}

interface OutlierAssistantResponse {
  outlierassistant: string;
}

chrome.runtime.onMessage.addListener(
  (
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: OutlierAssistantResponse) => void,
  ): boolean => {
    if (!message || typeof message !== 'object' || !('outlierassistant' in message)) {
      console.warn('Received invalid message format:', message);
      sendResponse({
        outlierassistant: JSON.stringify({
          error: 'Invalid message format',
          errorCode: 'INVALID_MESSAGE',
        }),
      });
      return false;
    }

    const request = message as OutlierAssistantRequest;

    if (request.outlierassistant === 'load') {
      getUserData(request.forceRefresh, request.autoCreateTab !== false)
        .then(result => {
          sendResponse({ outlierassistant: result });
        })
        .catch(error => {
          console.error('Unhandled error in getUserData:', error);
          sendResponse({
            outlierassistant: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              errorCode: 'HANDLER_ERROR',
            }),
          });
        });

      return true;
    }

    if (request.outlierassistant === 'clearCache') {
      clearCache()
        .then(() => {
          sendResponse({
            outlierassistant: JSON.stringify({
              success: true,
              message: 'Cache cleared',
            }),
          });
        })
        .catch(error => {
          sendResponse({
            outlierassistant: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
              errorCode: 'CLEAR_CACHE_ERROR',
            }),
          });
        });
      return true;
    }

    console.warn(`Unknown command: ${request.outlierassistant}`);
    sendResponse({
      outlierassistant: JSON.stringify({
        error: `Unknown command: ${request.outlierassistant}`,
        errorCode: 'UNKNOWN_COMMAND',
      }),
    });
    return false;
  },
);
