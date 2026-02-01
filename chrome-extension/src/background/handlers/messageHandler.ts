import type { OutlierAssistantRequest, OutlierAssistantResponse } from '../types';
import { fetchUserData, determineErrorCode } from '../services/apiService';
import { getCachedData, setCachedData, clearCache } from '../services/cacheService';
import { findOrCreateOutlierTab, cleanupCreatedTab, activateTabForLogin } from '../managers/tabManager';

const getUserData = async (forceRefresh = false, autoCreateTab = true): Promise<string> => {
  // Check cache first
  if (!forceRefresh) {
    const cached = await getCachedData();
    if (cached) return cached;
  }

  try {
    let tabId;
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

    let resultObj;
    try {
      resultObj = JSON.parse(result);
    } catch {
      console.error('Failed to parse result as JSON');
      return JSON.stringify({
        error: 'Invalid data returned from API',
        errorCode: 'INVALID_JSON',
      });
    }

    if (resultObj.error && resultObj.errorCode === 'NOT_LOGGED_IN') {
      await activateTabForLogin(tabId);
    } else {
      await cleanupCreatedTab();
    }

    // Only cache successful responses
    if (!resultObj.error) {
      await setCachedData(result);
    }

    return result;
  } catch (error) {
    await cleanupCreatedTab().catch(e => console.error('Error during tab cleanup:', e));

    console.error('Error retrieving user data:', error);

    let errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = determineErrorCode(error);

    if (errorCode === 'NOT_LOGGED_IN' && !errorMessage.includes('Please open')) {
      errorMessage = `${errorMessage} Please open https://app.outlier.ai/ in your browser and log in before using this extension.`;
    }

    return JSON.stringify({ error: errorMessage, errorCode });
  }
};

export const setupMessageHandler = (): void => {
  chrome.runtime.onMessage.addListener(
    (
      message: unknown,
      _sender: chrome.runtime.MessageSender,
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
        // Return true since sendResponse was already called synchronously.
        // Returning false could cause issues in some Chrome versions.
        return true;
      }

      const request = message as OutlierAssistantRequest;

      if (request.outlierassistant === 'load') {
        getUserData(request.forceRefresh, request.autoCreateTab !== false)
          .then(result => sendResponse({ outlierassistant: result }))
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
              outlierassistant: JSON.stringify({ success: true, message: 'Cache cleared' }),
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
      return true;
    },
  );
};
