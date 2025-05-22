chrome.storage.local.get("enabled", ({ enabled = true }) => {
  if (!enabled) {
    console.log("[Gemini Be Gone] Extension disabled...");
    return;
  }

  function detectAndHideAIOverview() {
    const headings = Array.from(document.querySelectorAll('h1'));
    const aiHeading = headings.find(el => el.textContent.trim().toLowerCase() === "ai overview");

    if (!aiHeading) return false;

    let parent = aiHeading.parentElement;
    while (parent && !parent.hasAttribute("jscontroller")) {
      parent = parent.parentElement;
    }
    if (!parent) return false;

    const jsControllerValue = parent.getAttribute("jscontroller");
    if (!jsControllerValue) return false;

    const cached = localStorage.getItem("aiController");
    if (cached === jsControllerValue) {
      console.log(`[Gemini Be Gone] Already cached: ${cached} — skipping update`);
      return true;
    }

    const style = document.createElement("style");
    style.textContent = `div[jscontroller="${jsControllerValue}"] { display: none !important; }`;
    document.head.appendChild(style);

    chrome.storage.local.set({ aiController: jsControllerValue }, () => {
      if (chrome.runtime.lastError) {
        console.error("[Gemini Be Gone] Failed to save aiController:", chrome.runtime.lastError);
      } else {
        console.log("[Gemini Be Gone] Detected and updated new AI overview controller:", jsControllerValue);
      }
    });
    localStorage.setItem("aiController", jsControllerValue);

    return true;
  }



    function waitForBodyAndObserve() {
      if (!document.body) {
        requestAnimationFrame(waitForBodyAndObserve);
        return;
      }

      const observer = new MutationObserver(() => {
        if (detectAndHideAIOverview()) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    waitForBodyAndObserve();
});