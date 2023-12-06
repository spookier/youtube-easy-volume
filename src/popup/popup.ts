export let isChromeUrl : boolean; // global state whether the current tab is a chrome:// URL


// Updates the numbers and slider according to the retrieved value
export function update_display(volume_value: number): void
{
	const display_number = document.getElementById("volDisplay");		// maybe use spanId instead?

	console.log(volume_value);
	if (display_number != null)
	{
		if(volume_value == 0 || volume_value == null)
		{
			display_number.innerHTML = "MUTED";
		}
		else
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
	return(null)
}



// Gets volume FOR THE FIRST INSTANCE the popup is opened, returns the volume value or null
export async function get_volume(): Promise<number | null>
{
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if (tab && tab.url && (tab.url.startsWith("chrome://") || tab.url.startsWith("https://chromewebstore.google.com/")))
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
				const volumeClass = document.querySelector(".ytp-volume-panel") as HTMLElement;
				if (volumeClass)
				{

					let vol_text = volumeClass?.getAttribute("aria-valuetext");
					if (vol_text?.includes("muted") == true)
					{
						return (0);
					}

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
		
		if (resolvedResults.length == null)
		{
			return (null);
		}

		let volume_value = resolvedResults[0].result;
		if (volume_value == null || volume_value == 0)
		{
			let display_number = document.getElementById("volDisplay");
			if (display_number != null)
			{
				display_number.innerHTML = "MUTED!";
			}
			return (null);
		}

		return (Number(volume_value));
	}
	return (null);
}

