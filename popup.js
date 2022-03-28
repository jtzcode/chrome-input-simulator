// Initialize butotn with users's prefered color
let inputBtn = document.getElementById("input-btn");
let clearBtn = document.getElementById("clear-btn");
let caseDropdown = document.getElementById("cases");
let hiddenInput = document.getElementById("verify-input");
let currentCase = null;
let cases = null;
var targetId = "input-text";

chrome.storage.sync.get("text", ({ text }) => {
  //changeColor.style.backgroundColor = color;
});

function getSelectedCase(selected) {
  currentCase = selected;
  inputBtn.disabled = true;
  clearBtn.disabled = true;
  chrome.runtime.sendMessage({ 
    command: "CaseChanged",
    case: cases[selected.value]
  }, () => {
    inputBtn.disabled = false;
    clearBtn.disabled = false;
  });
}

const startTest = function(data) {
  cases = data;
  console.log("Case data ready: ", cases);

  if (cases && cases.length) {
    cases.forEach((c, index) => {
      const opt = document.createElement('option');
      opt.value = index;
      opt.innerHTML = c.name;
      caseDropdown.appendChild(opt);
    });
  }

  chrome.runtime.sendMessage({ 
    command: "CaseChanged",
    case: cases[0]
  }, () => {
    inputBtn.disabled = false;
    clearBtn.disabled = false;
  });
}

function loadCases() {
  const url = chrome.runtime.getURL('/data/cases.json');
  fetch(url)
    .then((response) => response.json()) //assuming file contains json
    .then((cases) => {
      startTest(cases);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Get message from background", request);
    if (request.message == "verify") {
      verify(request.data.testCase, request.data.tabId);
    }
    return true;
});

// When the button is clicked, inject setPageBackgroundColor into current page
inputBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: startInput
  });
  chrome.runtime.sendMessage({ command: "input" });
});

clearBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: clearInput,
  });
  chrome.runtime.sendMessage({ command : "clear" });
});

// The body of this function will be execuetd as a content script inside the
// current page
function startInput() {
  chrome.storage.sync.get("text", ({ text }) => {
    //document.body.style.backgroundColor = color;
    console.log("Input started in current page: ", text);
  });
}

function clearInput() {
  document.getElementById(targetId).value = "";
  console.log("Input cleared in current page.");
}

function verify(testCase, tab) {
  // Copy text from content page
  hiddenInput.value = "";
  chrome.scripting.executeScript({
    target: { tabId: tab },
    function: copyInput,
    args: [targetId]
  }, () => {
    hiddenInput.focus();
    document.execCommand("paste");

    // read the clipboard contents from the background
    console.log("Text copied: ", hiddenInput.value);
    const results = hiddenInput.value;
    //alert(results === testCase.expected ? "Case Passed" : "Case Failed");
    //clearInput();
  });

  // Paste text to background page
  // let bg = chrome.runtime.getBackgroundPage((page) => {
  //   console.log("Background page object: ", page);
  // });        // get the background page
  // bg.document.body.innerHTML= "";                   // clear the background page

  // // add a DIV, contentEditable=true, to accept the paste action
  // let helperdiv = bg.document.createElement("div");
  // bg.document.body.appendChild(helperdiv);
  // helperdiv.contentEditable = true;

  // // focus the helper div's content
  // let range = document.createRange();
  // range.selectNode(helperdiv);
  // window.getSelection().removeAllRanges();
  // window.getSelection().addRange(range);
  // helperdiv.focus();    

  // // trigger the paste action
  // bg.document.execCommand("Paste");
}

function copyInput(targetId) {
  //document.execCommand("Copy");
  var copyText = document.getElementById(targetId);

  /* Select the text field */
  copyText.select();
  //copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  //navigator.clipboard.writeText(copyText.value);
  copied = document.execCommand('cut');
  console.log("Copy result: ", copied);
}

loadCases();
