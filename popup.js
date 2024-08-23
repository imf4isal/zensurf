async function injectStyle(tabId, file) {
    await chrome.scripting.insertCSS({
        files: [file],
        target: { tabId },
    });
}

// initital state
chrome.storage.local.get(['state'], async function ({ state }) {
    const toggleSwitch = document.getElementById('toggleSwitch');

    if (!state || state === 'OFF') {
        chrome.storage.local.set({ state: 'ON' });

        toggleSwitch.checked = true;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const { url, id: tabId } = tab;

        const extensionURL = 'youtube.com';
        if (url.includes(extensionURL)) {
            injectStyle(tabId, 'zen.css');
        }

        updateBadgeText(tabId, 'ON');
    } else {
        toggleSwitch.checked = true;
    }
});

document.getElementById('toggleSwitch').addEventListener('change', async (event) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const { url, id: tabId } = tab;

    const extensionURL = 'youtube.com';
    if (url.includes(extensionURL)) {
        const isChecked = event.target.checked;
        const nextState = isChecked ? 'ON' : 'OFF';

        if (nextState === 'ON') injectStyle(tabId, 'zen.css');
        else injectStyle(tabId, 'zenOff.css');

        chrome.storage.local.set({ state: nextState });
        updateBadgeText(tabId, nextState);
    }
});

function getState() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['state'], function ({ state }) {
            resolve(state);
        });
    });
}

function updateBadgeText(tabId, text) {
    chrome.action.setBadgeText({
        tabId,
        text,
    });
}
