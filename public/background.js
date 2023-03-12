// /*global chrome*/
import { handleTabChange } from "./util.js";
import {
  JOB_LINKS_WORKER,
  JOB_POSTING_WORKER,
  JOB_FORM_WORKER,
  handleMessaging,
} from "./worker.js";

/********************************************************************************************
 *
 * SERVICE WORKER CONSTANTS
 ********************************************************************************************/
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  let result = await chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    function: async () => {
      const nodeNlpModule = await import(
        "https://unpkg.com/node-nlp/dist/node-nlp.min.js"
      );
      // use the node-nlp module here
      console.log("inside");
      console.log(nodeNlpModule);
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
chrome.runtime.onConnect.addListener(handleMessaging);

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
