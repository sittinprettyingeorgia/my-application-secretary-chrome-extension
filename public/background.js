/*global chrome*/
import {
  JOB_LINKS_WORKER,
  JOB_POSTING_WORKER,
  handleTabChange,
  handleMessaging,
} from './util.js';
// this should repeatedly run the get-links script until it is complete
// chrome.tabs.onUpdated.addListener(handleJobLinksTab(tabId, changeInfo, tab));
/********************************************************************************************
 *
 * SERVICE WORKER CONSTANTS
 ********************************************************************************************/

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
