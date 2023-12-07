let slider = document.getElementById("volSlider") as HTMLInputElement; // id for slider
let volume = document.getElementById("volumeValue") as HTMLElement;     // number_displayed

// Set the default slider value
//volume.innerHTML = "100";


slider.addEventListener("input", function ()
{

  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
	if (tabs[0] && tabs[0].url && (tabs[0].url.startsWith("chrome://") || tabs[0].url.startsWith("https://chromewebstore.google.com/")))
		return ;
	volume.innerHTML = this.value;
	const finalValue = Number(this.value) / 100;
	
    const myTabId = tabs[0].id;

    if (myTabId !== undefined) {
      chrome.scripting.executeScript({
          target: { tabId: myTabId },
          func: changeVolume,
          args: [finalValue],
        },
      );
    }
  });

	function changeVolume(volume: number)
	{
		const videoElement = document.querySelector('.html5-main-video') as HTMLVideoElement | null;

		if (videoElement != null)
		{
			if(videoElement.muted == true)
			{
				videoElement.muted = false;

				const volumeClass = document.querySelector(".ytp-volume-panel") as HTMLElement;
				let vol_text = volumeClass?.getAttribute("aria-valuetext");
				if(vol_text?.includes("muted") == true)
				{
					vol_text = vol_text.replace("muted", "");
					volumeClass?.setAttribute("aria-valuetext", vol_text);
					
					toggleYouTubeMute(); 	// Calls the function to simulate a click on the YouTube mute button
				}
			}
			videoElement.volume = volume;
			update_youtube_display(volume);
		}


		function update_youtube_display(volume: number) : void
		{
			let volumePercentage = `${volume * 0.77 * 100}%`;								// Value for the YouTube slider
			const youtubeVolumeSlider = document.querySelector('.ytp-volume-slider-handle') as HTMLElement | null;
			if (youtubeVolumeSlider)
			{
				youtubeVolumeSlider.style.left = volumePercentage;
			}
			
			const volumeClass = document.querySelector(".ytp-volume-panel") as HTMLElement;
			if(!volumeClass)
				return ;

			let vol_text = volumeClass?.getAttribute("aria-valuetext");

			
			if(vol_text?.includes("muted") == true)
			{
				//console.log("@DEBUG - muted");
				return ;
			}

			let vol_value = volumeClass?.getAttribute("aria-valuenow");
			if(vol_value)
			{
				vol_value = String(volume * 100);
				volumeClass.setAttribute("aria-valuenow", vol_value);
			}
		}
		
		// Function to simulate a click on the YouTube mute button
		function toggleYouTubeMute() {
			// The selector for the mute button; this might change and needs to be verified
			const muteButtonSelector = '.ytp-mute-button';

			// Select the mute button element
			const muteButton = document.querySelector(muteButtonSelector);

			// Check if the mute button element is found
			if (muteButton)
			{
				// Create a new click event
				const clickEvent = new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window
				});

				// Dispatch the event to the mute button
				muteButton.dispatchEvent(clickEvent);
			}
			else
			{
				//console.log('Mute button not found');
			}
		}
	}
});



