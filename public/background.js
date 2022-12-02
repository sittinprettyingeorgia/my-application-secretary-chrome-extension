/*global chrome*/
import { setStorageLocalData, getAllStorageLocalData } from './util.js';
// this should repeatedly run the get-links script until it is complete
// chrome.tabs.onUpdated.addListener(handleJobLinksTab(tabId, changeInfo, tab));
/*****************************************
 *
 * UTIL
 *
 ******************************************/
/**
 * Remove a link from our stored and local links map
 * @param {key:href, val:href} links
 */
const deleteHref = (links, hrefToBeDeleted) => {
  const appInfo = getAppInfo(hrefToBeDeleted);
  delete links[appInfo.href];

  //window.localStorage.setItem(LINKS, JSON.stringify(links));
  console.log('FINISHED RUNNING APP SCRIPT', Object.keys(links).length);
  return links;
};
const REGEX = {
  CONTAINS_JOB_POSTING: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
  JOB_POSTING_URL: 'indeed.com/viewjob',
  CONTAINS_JOB_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
  CONTAINS_JOBS_LINKS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
  JOB_LINK_URL: 'indeed.com/jobs',
  JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=7',
};
const establishConnection = (msg, fields) => {
  console.log(msg.status);
  port.postMessage({ response: 'connected', ...fields });
};
const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const handleTabChange = async () => {
  //TODO: all local storage calls should be replace by our rest api
  const appInfo = {
    ...(await getAllStorageLocalData('indeed').then((items) => items)),
  };

  let tab = await getCurrentTab();

  const getLinks =
    tab.url.match(REGEX.JOB_LINK_URL) &&
    appInfo?.indeed?.user?.jobLinkCollectionInProgress;
  const applyNow =
    tab.url.match(REGEX.JOB_POSTING_URL) &&
    appInfo?.indeed?.user?.applyNowInProgress;

  if (tab.url) {
    if (getLinks) {
      handleNavigation('get-links', tab.id);
    } else if (applyNow) {
      handleNavigation('apply-now', tab.id);
    }
  }
};

const handleNavigation = (action, tabId) => {
  const navigateToJobLinksScript = async () => {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['./indeed/get-links.js'],
    });
  };

  const navigateToApplyNowScript = async () => {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['./indeed/apply-now.js'],
    });
  };

  switch (action) {
    case 'get-links':
      navigateToJobLinksScript();
      break;
    case 'apply-now':
      navigateToApplyNowScript();
  }
};
/*****************************************
 *
 * JOB LINKS WORK
 ******************************************/
const JOB_LINKS_WORKER = {
  main: async (tab) => {
    try {
      let mockInfo = {
        applicationName: 'indeed',
        user: {
          userId: '1',
          firstName: 'Mitchell',
          lastName: 'Blake',
          jobLinks: [],
          jobPreferences: {
            jobLinksLimit: 60,
          },
          jobLinkCollectionInProgress: true,
        },
      };
      //TODO: all local storage calls should be replace by our rest api
      await setStorageLocalData('indeed', mockInfo);
      let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=7`;
      await chrome.tabs.create({ url });
    } catch (e) {
      console.log(e?.message);
      console.log(e);
    }
  },
  handleJobLinkMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case 'connecting job-links messenger':
        establishConnection(msg, { port, messageId });
        break;
      case 'completed job-links scan':
        //content-script has scanned all job pages; we can move on
        break;
      case 'completed page scan':
        //content-script has scanned a single job page
        console.log(msg);
        break;
      case 'connection received, starting job scan':
        console.log(msg.status);
        break;
      case 'waiting for message':
        console.log('script did not receive background message');
      case 'debug':
        console.log(msg.debug);
      default:
        console.log('waiting for message', msg);
    }
  },
};
/*****************************************
 *
 * APPLY-NOW
 ******************************************/
//Base URL for job postings
const INDEED_BASE = 'https://www.indeed.com';
// base will need to be added to any links collected before being visited because
// all of our links are not full http links, they are paths ie. /my/path/1234365?as
const APPLY_NOW_WORKER = {
  main: async (tab) => {
    try {
      const appInfo = {
        ...(await getAllStorageLocalData('indeed').then((items) => items)),
      };

      let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=7`;
      await chrome.tabs.create({ url });
    } catch (e) {
      console.log(e?.message);
      console.log(e);
    }
  },
  handleApplyNowMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case 'connecting apply-now messenger':
        establishApplyNowConnection(msg, port, messageId);
        break;
      case 'completed apply-now':
        //content-script has scanned all applications; we can move on
        break;
      case 'connection received, handling application':
        console.log(msg.status);
        break;
      case 'waiting for message':
        console.log('script did not receive background message');
      case 'debug':
        console.log(msg.debug);
      default:
        console.log('waiting for message', msg);
    }
  },
};

/*****************************************
 *
 * MESSAGING
 ******************************************/
// handleExtensionMessagingTo/From content scripts
const handleMessaging = (port) => {
  // Asynchronously retrieve data from storage.sync, then cache it.
  // Generate a random 4-char key to avoid clashes if called multiple times
  let messageId = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

  port.onMessage.addListener(async (msg) => {
    switch (port.name) {
      case 'get-links':
        handleJobLinkMessaging(msg, port, messageId);
        break;
      case 'apply-now':
        handleApplyNowMessaging(msg, port, messageId);
        break;
      default:
        console.log('waiting for message', msg);
    }
  });
};

/********************************************************************************************
 *
 * SERVICE WORKER
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
const jobLinkFilters = {
  url: [{ urlMatches: REGEX.CONTAINS_JOBS_LINKS }],
};
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleTabChange(),
  jobLinkFilters
);

// Apply Now
const applyNowFilters = {
  url: [{ urlContains: REGEX.CONTAINS_JOB_POSTING }],
};
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleTabChange(),
  applyNowFilters
);
