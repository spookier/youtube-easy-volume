
export let isChromeUrl : boolean; // global state whether the current tab is a chrome:// URL

// Gets volume when popup is opened, returns the volume value or null
export async function get_volume(): Promise<number | null>
{
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (tab && tab.url && tab.url.startsWith("chrome://"))
	{
		isChromeUrl = false;
		return (null);
	}
	else
	{
		isChromeUrl = true;
	}
	
	if (tab && tab.id !== undefined)
	{
		const results = chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: () =>
			{
				let volumeClass = document.querySelector(".ytp-volume-panel") as HTMLElement;
				if (volumeClass)
				{
					let vol_value = volumeClass?.getAttribute("aria-valuenow");
					if (vol_value !== null || vol_value !== undefined)
					{
						return (vol_value);
					}
				}
				return (null);
			}
		});

		const resolvedResults = await results;

		let volume_value = resolvedResults[0].result;
		return (Number(volume_value));
	}
	return (null);
}


// Updates the numbers and slider according to the retrieved value
export function update_display(volume_value: number): void
{
	const display_number = document.getElementById("volDisplay");		// maybe use spanID
	if (display_number)
	{
		display_number.innerHTML = "VOLUME: " + volume_value;
	}
	const display_slider = document.getElementById("volSlider");
	if (display_slider && display_slider instanceof HTMLInputElement)
	{
		display_slider.value = volume_value.toString();
	}
}


export async function handleSliderMove(this: HTMLInputElement)
{
    const newVolume = Number(this.value); // gets input from slider 
    update_display(newVolume);
	//sendVolumeChange(newVolume);
	return(null)
}
