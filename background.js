let chatGptTabId = null;

function updateChatGPTTab(tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes("chatgpt.com")) {
        chatGptTabId = tabId;
    }
}

function adjustOtherTabsVolume(volume) {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.id !== chatGptTabId) {
                try {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (volume) => {
                            document.querySelectorAll("audio, video").forEach((media) => {
                                media.volume = volume;
                            });
                        },
                        args: [volume]
                    }).catch(err => console.warn(`Could not adjust volume on tab ${tab.id}:`, err));
                } catch (error) {
                    console.warn(`Execution failed on tab ${tab.id}:`, error);
                }
            }
        });
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId === chatGptTabId && "audible" in changeInfo) {
        if (changeInfo.audible) {
            console.log("ChatGPT is speaking. Reducing volume of other tabs.");
            adjustOtherTabsVolume(0.35);
        } else {
            console.log("ChatGPT is silent. Restoring volume of other tabs.");
            adjustOtherTabsVolume(1.0);
        }
    }
});

// Detect when ChatGPT is opened in a new tab
chrome.tabs.onCreated.addListener(updateChatGPTTab);
chrome.tabs.onUpdated.addListener(updateChatGPTTab);

