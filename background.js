chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ state: 'OFF' });

  chrome.action.setBadgeText({
    text: 'OFF',
  });
});
const extensionURL = 'https://www.youtube.com';

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensionURL)) {
    chrome.storage.local.get(['state'], async function (result) {
      const prevState = result.state;

      const nextState = prevState === 'ON' ? 'OFF' : 'ON';

      chrome.storage.local.set({ state: nextState });

      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
      });

      if (nextState === 'ON') {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.insertCSS({
          files: ['zen.css'],
          target: { tabId: tab.id },
        });
      } else if (nextState === 'OFF') {
        // Remove the CSS file when the user turns the extension off
        await chrome.scripting.removeCSS({
          files: ['zen.css'],
          target: { tabId: tab.id },
        });
      }
    });
  }
});
