chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ state: 'OFF' });

  chrome.action.setBadgeText({
    text: 'OFF',
  });
});
const extensionURL = 'youtube.com';

chrome.action.onClicked.addListener(async (tab) => {
  const { url, id: tabId } = tab;

  if (url.includes(extensionURL)) {
    const prevState = await getState();
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    if (nextState === 'ON') injectStyle(tabId, 'zen.css');
    else injectStyle(tabId, 'zenOff.css');
    // removing style creates bug - https://github.com/imf4isal/zensurf/issues/6

    chrome.storage.local.set({ state: nextState });
    updateBadgeText(tabId, nextState);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const { url } = tab;
  const state = await getState();

  if (url && url.includes(extensionURL) && state === 'ON')
    injectStyle(tabId, 'zen.css');
  updateBadgeText(tabId, state);
});

function updateBadgeText(tabId, text) {
  chrome.action.setBadgeText({
    tabId,
    text,
  });
}

async function injectStyle(tabId, file) {
  await chrome.scripting.insertCSS({
    files: [file],
    target: { tabId },
  });
}

function getState() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['state'], function ({ state }) {
      resolve(state);
      //@TODO: handle error
    });
  });
}
