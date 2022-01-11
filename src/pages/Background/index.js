async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  chrome.storage.sync.set({ currentURL: tab.url });
}

chrome.runtime.onInstalled.addListener(async () => {
  await getCurrentTab();
});

// chrome.webNavigation.onHistoryStateUpdated.addListener(async function () {
//   // chrome.runtime.reload();
//   console.log('state change reloading');
//   let queryOptions = { active: true, currentWindow: true };
//   let [tab] = await chrome.tabs.query(queryOptions);
//   await chrome.scripting.executeScript({
//     target: {
//       tabId: tab.id,
//     },
//     files: ['contentScript.bundle.js'],
//   });
// });
