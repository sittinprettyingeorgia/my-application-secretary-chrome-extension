// /*global chrome*/
import { handleTabChange } from "./util.js";
import {
  JOB_LINKS_WORKER,
  JOB_POSTING_WORKER,
  JOB_FORM_WORKER,
  handleMessaging,
} from "./worker.js";

let socket;

const connectWSS = () => {
  //TODO: env var
  socket = new WebSocket("ws://localhost:8080");

  socket.addEventListener("open", (event) => {
    console.log("Connected to server");
  });

  socket.addEventListener("message", (event) => {
    console.log("Received message:", event.data);
  });

  socket.addEventListener("close", (event) => {
    console.log("Disconnected from server");
    setTimeout(() => {
      connectWSS();
    }, 1000);
  });
};

const handleMessagingWSS = handleMessaging.bind(null, socket, connectWSS);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendWSSMessage("testbk");
});
/********************************************************************************************
 *
 * SERVICE WORKER CONSTANTS
 ********************************************************************************************/
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  let result = await chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: async () => {
      const nlpModule = await import(
        "https://unpkg.com/node-nlp/dist/node-nlp.min.js"
      );
      // use the node-nlp module here
      console.log("inside");
      console.log(nlpModule);
    },
  });
  console.log(result);
});

/*****************************************
 *
 * CHROME MAIN
 *
 ******************************************/

//this is where we communicate with our content scripts.
chrome.runtime.onConnect.addListener(handleMessagingWSS);

//this is our extension icon click response
chrome.action.onClicked.addListener(JOB_LINKS_WORKER.main);

/*****************************************
 *
 * NAVIGATION
 *
 ******************************************/
// General
chrome.tabs.onUpdated.addListener(async () => await handleTabChange());
chrome.webNavigation.onTabReplaced.addListener(
  async () => await handleTabChange()
);

// Get Job Links
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleTabChange(),
  JOB_LINKS_WORKER.filter
);

// Job Posting
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleTabChange(),
  JOB_POSTING_WORKER.filter
);

// Job FORM
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleTabChange(),
  JOB_FORM_WORKER.filter
);
