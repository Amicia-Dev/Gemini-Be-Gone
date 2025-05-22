chrome.storage.local.get(["enabled", "aiController"], ({ enabled = true, aiController }) => {
  if (!enabled) {
    return;
  }

    const controller = localStorage.getItem("aiController");
    if (controller) {
      const style = document.createElement("style");
      style.textContent = `
        div[jscontroller="${controller}"] {
          display: none !important;
        }
      `;
      document.documentElement.appendChild(style);
    } else {
      console.log("[Gemini Be Gone] No cached controller found in localStorage");
    }
});