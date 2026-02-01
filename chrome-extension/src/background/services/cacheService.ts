import type { CacheEntry } from '../types';
import { CACHE_DURATION } from '../types';

const CACHE_KEY = 'userData';

/**
 * Persistent cache using chrome.storage.session.
 *
 * Unlike in-memory caches, this survives service worker suspension/restart
 * within the same browser session. Data is cleared on browser restart,
 * which is desirable for a cache (prevents showing stale data).
 */

export const getCachedData = async (): Promise<string | null> => {
  try {
    const result = await chrome.storage.session.get(CACHE_KEY);
    const entry = result[CACHE_KEY] as CacheEntry | undefined;

    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      // Best-effort removal of stale entry; failure is non-critical
      chrome.storage.session.remove(CACHE_KEY).catch(e => console.error('Failed to remove stale cache:', e));
      return null;
    }

    console.log('Returning cached user data');
    return entry.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

export const setCachedData = async (data: string): Promise<void> => {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    await chrome.storage.session.set({ [CACHE_KEY]: entry });
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await chrome.storage.session.remove(CACHE_KEY);
    console.log('Cache cleared');
  } catch (error) {
    console.error('Cache clear error:', error);
    throw error;
  }
};
