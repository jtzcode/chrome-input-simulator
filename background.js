let text = 'Hello Simulator!';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ text });
  console.log('Default text sent to page', `text: ${text}`);
});
