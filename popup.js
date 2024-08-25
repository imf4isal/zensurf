async function injectStyle(tabId, file) {
    await chrome.scripting.insertCSS({
        files: [file],
        target: { tabId },
    });
}

async function removeStyle(tabId, file) {
    await chrome.scripting.removeCSS({
        files: [file],
        target: { tabId },
    });
}

// Initial state
chrome.storage.local.get(
    ['state', 'fullZenState'],
    async function ({ state, fullZenState }) {
        const toggleSwitch = document.getElementById('toggleSwitch');
        const fullZenSwitch = document.getElementById('fullZenSwitch');

        if (!state || state === 'OFF') {
            chrome.storage.local.set({ state: 'ON' });
            toggleSwitch.checked = true;

            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            const { url, id: tabId } = tab;

            const extensionURL = 'youtube.com';
            if (url.includes(extensionURL)) {
                injectStyle(tabId, 'zen.css');
            }

            updateBadgeText(tabId, 'ON');
        } else {
            toggleSwitch.checked = true;
        }

        // Set the fullZenSwitch state based on stored value
        if (fullZenState === 'ON') {
            fullZenSwitch.checked = true;

            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            const { url, id: tabId } = tab;

            const extensionURL = 'youtube.com';
            if (url.includes(extensionURL)) {
                injectStyle(tabId, 'zenFull.css');
            }
        }
    }
);

// Toggle for the main Zen Mode switch
document
    .getElementById('toggleSwitch')
    .addEventListener('change', async (event) => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const { url, id: tabId } = tab;

        const extensionURL = 'youtube.com';
        if (url.includes(extensionURL)) {
            const isChecked = event.target.checked;
            const nextState = isChecked ? 'ON' : 'OFF';

            if (nextState === 'ON') injectStyle(tabId, 'zen.css');
            else {
                injectStyle(tabId, 'zenOff.css');
                removeStyle(tabId, 'zenFull.css');
                chrome.storage.local.set({ fullZenState: 'OFF' });
                document.getElementById('fullZenSwitch').checked = false;
            }

            chrome.storage.local.set({ state: nextState });
            updateBadgeText(tabId, nextState);
        }
    });

// recommendations toggle
document
    .getElementById('fullZenSwitch')
    .addEventListener('change', async (event) => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        const { url, id: tabId } = tab;

        const extensionURL = 'youtube.com';
        if (url.includes(extensionURL)) {
            const isChecked = event.target.checked;
            const fullZenState = isChecked ? 'ON' : 'OFF';

            if (fullZenState === 'ON') injectStyle(tabId, 'zenFull.css');
            else removeStyle(tabId, 'zenFull.css');

            chrome.storage.local.set({ fullZenState });
        }
    });

// update badge text
function updateBadgeText(tabId, text) {
    chrome.action.setBadgeText({
        tabId,
        text,
    });
}
