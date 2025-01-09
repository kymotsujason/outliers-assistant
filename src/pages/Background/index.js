// Function to get the logged-in user from local storage
const getLocalStorage = () =>
  localStorage.getItem('lscache-internal/logged_in_user');

// Function to execute the getLocalStorage function in the context of a given tab
const executeScriptOnTab = async (tabId) => {
  const [res] = await chrome.scripting.executeScript({
    target: { tabId },
    func: getLocalStorage,
  });
  return res.result ? res.result : JSON.stringify({});
};

// Listener for messages from the extension's popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.outlierassistant === 'load') {
    // Async function to handle the response
    const handleResponse = async () => {
      try {
        // Query all tabs with the specified URL pattern
        const queryOptions = { url: 'https://app.outlier.ai/*' };
        const tabs = await chrome.tabs.query(queryOptions);

        if (tabs.length > 0) {
          // If tabs with the specified URL are found, execute the script on the first tab
          const result = await executeScriptOnTab(tabs[0].id);
          sendResponse({ outlierassistant: result });
        } else {
          // If no tabs are found, create a new tab with the specified URL
          chrome.tabs.create(
            {
              active: false,
              url: 'https://app.outlier.ai/static/img/outlier/logotype.svg',
            },
            async (tab) => {
              // Execute the script on the newly created tab and send the response
              const result = await executeScriptOnTab(tab.id);
              sendResponse({ outlierassistant: result });
              // Close the newly created tab after execution
              chrome.tabs.remove(tab.id);
            }
          );
        }
      } catch (error) {
        // Send an error response if an exception occurs
        sendResponse({
          outlierassistant: JSON.stringify({ error: error.message }),
        });
      }
    };

    // Call the async function to handle the response
    handleResponse();
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
