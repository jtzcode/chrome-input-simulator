let text = 'Hello Simulator!';

let keydownEvent3 = {
  type: 'keyDown', 
  key: "Backspace",
  code: "Backspace",
  windowsVirtualKeyCode: 8,
  nativeVirtualKeyCode: 8,
  macCharCode: 8
};
let keyupEvent3 = {
  type: 'keyUp', 
  key: "Backspace",
  code: "Backspace",
  windowsVirtualKeyCode: 8,
  nativeVirtualKeyCode: 8,
  macCharCode: 8
};
let currentCase = null;
let casePromises = [];


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ text });
  console.log('Default text sent to page', `text: ${text}`);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.command === "input") {
    if (currentCase && currentCase.keySequence) {
      chrome.tabs.query({active: true}, function(tabs) {
          chrome.debugger.attach({ tabId: tabs[0].id }, "1.0");
          currentCase.keySequence.forEach(function(item) {
              casePromises.push(chrome.debugger.sendCommand({ tabId: tabs[0].id }, item.command, item.key));
          });
          Promise.all(casePromises).then(() => {
            chrome.debugger.detach({ tabId: tabs[0].id });
            casePromises = [];
          });
      });
    }
  } else if (message.command === 'CaseChanged') {
    currentCase = message.case
    casePromises = [];
    sendResponse();
  }
  return true;
});
