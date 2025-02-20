chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setVolume") {
        let volumeLevel = message.volume;
        document.querySelectorAll("audio, video").forEach(element => {
            element.volume = volumeLevel;
        });
        sendResponse({ status: "Volume adjusted to " + volumeLevel });
    }
});


