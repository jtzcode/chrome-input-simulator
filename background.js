let text = 'Hello Simulator!';

let keydownEvent = {
  type: 'keyDown', 
  key: "a",
  code: "KeyA",
  text: 'a',
  windowsVirtualKeyCode: 65,
  nativeVirtualKeyCode: 65,
  macCharCode: 65
};

let keyupEvent = {
  type: 'keyUp', 
  windowsVirtualKeyCode: 65,
  nativeVirtualKeyCode: 65,
  macCharCode: 65,
  key: "a",
  code: "KeyA"
};

let keydownEvent2 = {
  type: 'keyDown', 
  key: "b",
  code: "KeyB",
  text: 'b',
  windowsVirtualKeyCode: 66,
  nativeVirtualKeyCode: 66,
  macCharCode: 66
};

let keyupEvent2 = {
  type: 'keyUp', 
  windowsVirtualKeyCode: 66,
  nativeVirtualKeyCode: 66,
  macCharCode: 66,
  key: "b",
  code: "KeyB"
};

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

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ text });
  console.log('Default text sent to page', `text: ${text}`);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.command === "input"){
      chrome.tabs.query({active: true}, function(tabs) {
          chrome.debugger.attach({ tabId: tabs[0].id }, "1.0");
          Promise.all([
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Input.dispatchKeyEvent', keydownEvent),
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Input.dispatchKeyEvent', keyupEvent),
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Input.dispatchKeyEvent', keydownEvent2),
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Input.dispatchKeyEvent', keyupEvent2),
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Input.dispatchKeyEvent', keydownEvent3),
            chrome.debugger.sendCommand({ tabId: tabs[0].id }, 'Input.dispatchKeyEvent', keyupEvent3)
          ]).then(() => {
            chrome.debugger.detach({ tabId: tabs[0].id });
          });
      });
  }
  return true;
});
