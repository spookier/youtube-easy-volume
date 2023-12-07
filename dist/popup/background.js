"use strict";
let slider = document.getElementById("volSlider");
let volume = document.getElementById("volumeValue");
slider.addEventListener("input", function () {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && (tabs[0].url.startsWith("chrome://") || tabs[0].url.startsWith("https://chromewebstore.google.com/")))
            return;
        volume.innerHTML = this.value;
        const finalValue = Number(this.value) / 100;
        const myTabId = tabs[0].id;
        if (myTabId !== undefined) {
            chrome.scripting.executeScript({
                target: { tabId: myTabId },
                func: changeVolume,
                args: [finalValue],
            });
        }
    });
    function changeVolume(volume) {
        const videoElement = document.querySelector('.html5-main-video');
        if (videoElement != null) {
            if (videoElement.muted == true) {
                videoElement.muted = false;
                const volumeClass = document.querySelector(".ytp-volume-panel");
                let vol_text = volumeClass === null || volumeClass === void 0 ? void 0 : volumeClass.getAttribute("aria-valuetext");
                if ((vol_text === null || vol_text === void 0 ? void 0 : vol_text.includes("muted")) == true) {
                    vol_text = vol_text.replace("muted", "");
                    volumeClass === null || volumeClass === void 0 ? void 0 : volumeClass.setAttribute("aria-valuetext", vol_text);
                    toggleYouTubeMute();
                }
            }
            videoElement.volume = volume;
            update_youtube_display(volume);
        }
        function update_youtube_display(volume) {
            let volumePercentage = `${volume * 0.77 * 100}%`;
            const youtubeVolumeSlider = document.querySelector('.ytp-volume-slider-handle');
            if (youtubeVolumeSlider) {
                youtubeVolumeSlider.style.left = volumePercentage;
            }
            const volumeClass = document.querySelector(".ytp-volume-panel");
            if (!volumeClass)
                return;
            let vol_text = volumeClass === null || volumeClass === void 0 ? void 0 : volumeClass.getAttribute("aria-valuetext");
            if ((vol_text === null || vol_text === void 0 ? void 0 : vol_text.includes("muted")) == true) {
                return;
            }
            let vol_value = volumeClass === null || volumeClass === void 0 ? void 0 : volumeClass.getAttribute("aria-valuenow");
            if (vol_value) {
                vol_value = String(volume * 100);
                volumeClass.setAttribute("aria-valuenow", vol_value);
            }
        }
        function toggleYouTubeMute() {
            const muteButtonSelector = '.ytp-mute-button';
            const muteButton = document.querySelector(muteButtonSelector);
            if (muteButton) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                muteButton.dispatchEvent(clickEvent);
            }
            else {
            }
        }
    }
});
//# sourceMappingURL=background.js.map