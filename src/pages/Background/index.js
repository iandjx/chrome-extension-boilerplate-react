async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  chrome.storage.sync.set({ currentURL: tab.url });
}

chrome.runtime.onInstalled.addListener(async () => {
  await getCurrentTab();
});
