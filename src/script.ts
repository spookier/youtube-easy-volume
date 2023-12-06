import { get_volume, update_display } from "./popup/popup.js"
import { handleSliderMove, isChromeUrl } from "./popup/popup.js"


async function initPopup()
{
    let volume = await get_volume();

	if (volume)
	{
		update_display(volume);
	}
	const slider = document.getElementById("volSlider");
	if (slider && isChromeUrl == true)
	{
		slider.addEventListener("input", handleSliderMove);
	}
}

document.addEventListener("DOMContentLoaded", initPopup);
