// Initialize butotn with users's prefered color
let inputBtn = document.getElementById("input-btn");
let clearBtn = document.getElementById("clear-btn");

chrome.storage.sync.get("text", ({ text }) => {
  //changeColor.style.backgroundColor = color;
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
