import { OUTLIER_URL, API_TIMEOUT, MAX_RETRIES, RETRY_DELAY } from '../types';
import type { ErrorCode } from '../types';
import { getOutlierCookies } from './cookieService';

export const determineErrorCode = (error: unknown): ErrorCode => {
  if (!(error instanceof Error)) return 'UNKNOWN_ERROR';

  const msg = error.message.toLowerCase();

  if (
    msg.includes('log in') ||
    msg.includes('logged in') ||
    msg.includes('authentication') ||
    msg.includes('authenticated') ||
    msg.includes('session') ||
    msg.includes('csrf')
  ) {
    return 'NOT_LOGGED_IN';
  }
  if (msg.includes('network') || msg.includes('connection')) return 'NETWORK_ERROR';
  if (msg.includes('timeout') || msg.includes('timed out')) return 'TIMEOUT';

  return 'API_REQUEST_FAILED';
};

/**
 * Fetches user data from the Outlier API with retry logic and exponential backoff.
 * Returns raw JSON string on success, or a stringified error object on failure.
 */
export const fetchUserData = async (retryCount = 0): Promise<string> => {
  try {
    if (retryCount > 0) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`Waiting ${delay}ms before retry ${retryCount}`);
    }

    const cookieObj = await getOutlierCookies();

    console.log('Making API request to fetch user data');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('API request timed out');
    }, API_TIMEOUT);

    try {
      const response = await fetch(`${OUTLIER_URL}internal/logged_in_user`, {
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

      clearTimeout(timeoutId);

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
