import type { TabId } from '../types';
import { OUTLIER_URL, TAB_LOAD_TIMEOUT } from '../types';

let createdTabId: TabId | null = null;

/**
 * Promise-based guard against concurrent tab creation.
 * If a creation is in-flight, subsequent callers await the same promise
 * instead of racing to create duplicate tabs.
 */
let tabCreationPromise: Promise<TabId> | null = null;

const isOutlierTab = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'app.outlier.ai' || urlObj.hostname.endsWith('.outlier.ai');
  } catch {
    return url.includes('outlier.ai/');
  }
};

/**
 * Waits for a tab to finish loading using chrome.tabs.onUpdated events
 * instead of polling. Handles edge cases:
 * - Tab already complete (immediate check after listener registration)
 * - Tab closed during load (onRemoved listener)
 * - Timeout after TAB_LOAD_TIMEOUT ms
 */
const waitForTabLoad = (tabId: number): Promise<void> => {
  console.log(`Waiting for tab ${tabId} to complete loading...`);

  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      if (settled) return;
      settled = true;
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.tabs.onRemoved.removeListener(onRemoved);
      clearTimeout(timeoutId);
    };

    const onUpdated = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
      if (!isOutlierTab(tab.url)) return;

      console.log(`Tab ${tabId} loaded successfully`);
      cleanup();
      resolve();
    };

    const onRemoved = (removedTabId: number) => {
      if (removedTabId !== tabId) return;
      cleanup();
      reject(new Error(`Tab ${tabId} was closed before it finished loading`));
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Tab loading timed out'));
    }, TAB_LOAD_TIMEOUT);

    // Register listeners first
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.onRemoved.addListener(onRemoved);

    // Immediate check: tab may already be complete before listener was added
    chrome.tabs
      .get(tabId)
      .then(tab => {
        if (!settled && tab.status === 'complete' && isOutlierTab(tab.url)) {
          console.log(`Tab ${tabId} was already loaded`);
          cleanup();
          resolve();
        }
      })
      .catch(error => {
        cleanup();
        reject(new Error(`Tab ${tabId} not found: ${error instanceof Error ? error.message : String(error)}`));
      });
  });
};

const createOutlierTab = async (): Promise<TabId> => {
  console.log('Creating new tab for Outlier site');

  const tab = await chrome.tabs.create({
    url: OUTLIER_URL,
    active: false,
  });

  if (!tab.id) {
    throw new Error('Failed to create tab (no ID returned)');
  }

  createdTabId = tab.id as TabId;
  console.log(`Created new tab with ID ${createdTabId}`);

  await waitForTabLoad(createdTabId);
  return createdTabId;
};

/**
 * Finds an existing Outlier tab or creates a new one.
 * Wraps the entire operation in a shared promise to prevent race conditions
 * where two concurrent calls both see no existing tab and both try to create one.
 */
export const findOrCreateOutlierTab = (autoCreate = true): Promise<TabId> => {
  // If an operation is already in-flight, all callers share the same promise
  if (tabCreationPromise) {
    return tabCreationPromise;
  }

  tabCreationPromise = (async () => {
    try {
      const tabs = await chrome.tabs.query({});
      const outlierTab = tabs.find(tab => isOutlierTab(tab.url) && tab.id !== undefined);

      if (outlierTab?.id) {
        console.log(`Found existing Outlier tab: ${outlierTab.id}`);
        return outlierTab.id as TabId;
      }

      if (!autoCreate) {
        throw new Error('No Outlier tabs found and auto-create is disabled');
      }

      return await createOutlierTab();
    } catch (error) {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('not allowed'))) {
        throw new Error('Missing tabs permission. Please check extension permissions.');
      }
      throw error;
    } finally {
      tabCreationPromise = null;
    }
  })();

  return tabCreationPromise;
};

export const cleanupCreatedTab = async (): Promise<void> => {
  const tabIdToClose = createdTabId;
  if (tabIdToClose === null) return;

  // Clear immediately to prevent double-cleanup
  createdTabId = null;

  try {
    console.log(`Closing created tab ${tabIdToClose}`);
    await chrome.tabs.remove(tabIdToClose);
    console.log(`Tab ${tabIdToClose} closed successfully`);
  } catch (error) {
    console.error(`Error closing tab ${tabIdToClose}:`, error);
  }
};

export const activateTabForLogin = async (tabId: TabId): Promise<void> => {
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
