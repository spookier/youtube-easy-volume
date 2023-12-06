var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { get_volume, update_display } from "./popup/popup.js";
import { handleSliderMove, isChromeUrl } from "./popup/popup.js";
function initPopup() {
    return __awaiter(this, void 0, void 0, function* () {
        let volume = yield get_volume();
        if (volume) {
            update_display(volume);
        }
        const slider = document.getElementById("volSlider");
        if (slider && isChromeUrl == true) {
            slider.addEventListener("input", handleSliderMove);
        }
    });
}
document.addEventListener("DOMContentLoaded", initPopup);
//# sourceMappingURL=script.js.map