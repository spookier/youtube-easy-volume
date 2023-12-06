"use strict";
let slider = document.getElementById("volSlider");
let volume = document.getElementById("volumeValue");
volume.innerHTML = slider.value;
slider.addEventListener("input", function () {
    volume.innerHTML = this.value;
    const finalValue = Number(this.value) / 100;
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        if (tabs[0] && tabs[0].url && tabs[0].url.startsWith("chrome://")) {
            return;
        }
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
        if (videoElement) {
            videoElement.volume = volume;
            update_youtube_display(volume);
        }
        function update_youtube_display(volume) {
            let volumePercentage = `${volume * 0.77 * 100}%`;
            const youtubeVolumeSlider = document.querySelector('.ytp-volume-slider-handle');
            const volumeClass = document.querySelector(".ytp-volume-panel");
            let vol_value = volumeClass === null || volumeClass === void 0 ? void 0 : volumeClass.getAttribute("aria-valuenow");
            if (youtubeVolumeSlider) {
                youtubeVolumeSlider.style.left = volumePercentage;
            }
            if (vol_value) {
                vol_value = String(volume * 100);
                volumeClass.setAttribute("aria-valuenow", vol_value);
            }
        }
    }
});
//# sourceMappingURL=background.js.map