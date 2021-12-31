console.log('This is the background page.');
console.log('Put the background scripts here.');
console.log('hi, new change');
let color = '#3aa757';
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);

  chrome.storage.sync.set({ currentURL: tab.url });
  console.log('currentURL set to ', tab.url);
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  await getCurrentTab();
});
