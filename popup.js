const toggleSwitch = document.getElementById("toggleSwitch");

chrome.storage.local.get("enabled", (data) => {
  toggleSwitch.checked = data.enabled !== false;
});

toggleSwitch.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: toggleSwitch.checked }, () => {
    console.log(`[Gemini Be Gone] Enabled set to: ${toggleSwitch.checked}`);


    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.url.includes("://www.google.") && tab.url.includes("/search")) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
});