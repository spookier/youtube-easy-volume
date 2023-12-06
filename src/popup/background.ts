let slider = document.getElementById("volSlider") as HTMLInputElement; // id for slider
let volume = document.getElementById("volumeValue") as HTMLElement;     // number_displayed
volume.innerHTML = slider.value;

slider.addEventListener("input", function ()
{
  volume.innerHTML = this.value;
  const finalValue = Number(this.value) / 100;

  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
	if (tabs[0] && tabs[0].url && tabs[0].url.startsWith("chrome://"))
	{
		return ;
	}
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
		if (videoElement)
		{
			videoElement.volume = volume;
			update_youtube_display(volume);
		}

		function update_youtube_display(volume: number)
		{
			let volumePercentage = `${volume * 0.77 * 100}%`;								// Value for the YouTube slider
			const youtubeVolumeSlider = document.querySelector('.ytp-volume-slider-handle') as HTMLElement | null;

			const volumeClass = document.querySelector(".ytp-volume-panel") as HTMLElement;
			let vol_value = volumeClass?.getAttribute("aria-valuenow");


			if (youtubeVolumeSlider)
			{
				youtubeVolumeSlider.style.left = volumePercentage;
			}
			if(vol_value)
			{
				vol_value = String(volume * 100);
				volumeClass.setAttribute("aria-valuenow", vol_value);
			}
		}
	}
});
