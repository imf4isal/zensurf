chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ state: 'OFF' });

  chrome.action.setBadgeText({
    text: 'OFF',
  });
});
const extensionURL = 'youtube.com';

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes(extensionURL)) {
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

        await chrome.scripting.insertCSS({
          files: ['zenOff.css'],
          target: { tabId: tab.id },
        });
      }
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes(extensionURL)) {
    chrome.storage.local.get(['state'], async function (result) {
      if (result.state === 'ON') {
        await chrome.scripting.insertCSS({
          files: ['zen.css'],
          target: { tabId: tab.id },
        });
        await chrome.action.setBadgeText({
          tabId: tab.id,
          text: 'ON',
        });
      } else {
        await chrome.action.setBadgeText({
          tabId: tab.id,
          text: 'OFF',
        });
      }
    });
  } else {
    chrome.storage.local.get(['state'], async function (result) {
      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: result.state,
      });
    });
  }
});
