var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export let isChromeUrl;
export function get_volume() {
    return __awaiter(this, void 0, void 0, function* () {
        let [tab] = yield chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && tab.url.startsWith("chrome://")) {
            isChromeUrl = false;
            return (null);
        }
        else {
            isChromeUrl = true;
        }
        if (tab && tab.id !== undefined) {
            const results = chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    let volumeClass = document.querySelector(".ytp-volume-panel");
                    if (volumeClass) {
                        let vol_value = volumeClass === null || volumeClass === void 0 ? void 0 : volumeClass.getAttribute("aria-valuenow");
                        if (vol_value !== null || vol_value !== undefined) {
                            return (vol_value);
                        }
                    }
                    return (null);
                }
            });
            const resolvedResults = yield results;
            let volume_value = resolvedResults[0].result;
            return (Number(volume_value));
        }
        return (null);
    });
}
export function update_display(volume_value) {
    const display_number = document.getElementById("volDisplay");
    if (display_number) {
        display_number.innerHTML = "VOLUME: " + volume_value;
    }
    const display_slider = document.getElementById("volSlider");
    if (display_slider && display_slider instanceof HTMLInputElement) {
        display_slider.value = volume_value.toString();
    }
}
export function handleSliderMove() {
    return __awaiter(this, void 0, void 0, function* () {
        const newVolume = Number(this.value);
        update_display(newVolume);
        return (null);
    });
}
//# sourceMappingURL=popup.js.map