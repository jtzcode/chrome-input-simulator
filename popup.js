// Initialize butotn with users's prefered color
let inputBtn = document.getElementById("input-btn");
let clearBtn = document.getElementById("clear-btn");
let caseDropdown = document.getElementById("cases");
let currentCase = null;
let cases = null;

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
});

// When the button is clicked, inject setPageBackgroundColor into current page
inputBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: startInput,
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
  document.getElementById("input-span").innerText = "";
  console.log("Input cleared in current page.");
}

loadCases();
