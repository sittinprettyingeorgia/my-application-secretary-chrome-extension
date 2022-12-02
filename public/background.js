/*global chrome*/
import { setStorageLocalData, getAllStorageLocalData } from './util.js';
// base will need to be added to any links collected before being visited because
// all of our links are not full http links, they are paths ie. /my/path/1234365?as
/*****************************************
 *
 * NAVIGATION
 ******************************************/
const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

/*****************************************
 *
 * JOB LINKS
 ******************************************/
// retrieve job links for a user
const handleJobLinksTab = async (tabId, changeInfo, tab) => {
  //TODO: all local storage calls should be replace by our rest api
  const appInfo = {
    ...(await getAllStorageLocalData('indeed').then((items) => items)),
  };

  if (changeInfo.status === 'complete' && tab.url) {
    if (
      tab.url.match('indeed.com/jobs') &&
      appInfo?.indeed?.user?.jobLinkCollectionInProgress
    ) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['./indeed/get-links.js'],
      });
    }
  }
};
// retrieve job links for a user
const handleJobLinksWebNav = async () => {
  //TODO: all local storage calls should be replace by our rest api
  const appInfo = {
    ...(await getAllStorageLocalData('indeed').then((items) => items)),
  };

  let tab = await getCurrentTab();
  if (
    tab.url.match('indeed.com/jobs') &&
    appInfo?.indeed?.user?.jobLinkCollectionInProgress
  ) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./indeed/get-links.js'],
    });
  }
};
// handle messaging with job-links content script
const handleJobLinkMessaging = (msg, port, messageId) => {
  switch (msg.status) {
    case 'connecting job-links messenger':
      establishConnection(msg, port, messageId);
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
};

/*****************************************
 *
 * APPLY-NOW
 ******************************************/
const handleApplyNowMessaging = (msg, port, messageId) => {
  switch (msg.status) {
    case 'connecting apply-now messenger':
      establishConnection(msg, port, messageId);
      break;
    case 'completed apply-now':
      //content-script has scanned all job pages; we can move on
      break;
    case 'connection received, starting apply-now':
      console.log(msg.status);
      break;
    case 'waiting for message':
      console.log('script did not receive background message');
    case 'debug':
      console.log(msg.debug);
    default:
      console.log('waiting for message', msg);
  }
};
/*****************************************
 *
 * MESSAGING
 ******************************************/
// establish a connection with a content-script
const establishConnection = (msg, port, messageId) => {
  console.log(msg.status);
  port.postMessage({ response: 'connected', messageId });
};
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

/*****************************************
 *
 * SERVICE WORKER
 ******************************************/
const onClickWorker = async (tab) => {
  try {
    /*let mockInfo = {
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
    await setStorageLocalData('indeed', mockInfo);*/
    let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=7`;
    await chrome.tabs.create({ url });
  } catch (e) {
    console.log(e?.message);
    console.log(e);
  }
};

const jobLinkFilters = {
  url: [{ hostSuffix: 'indeed.com' }],
};

//this is where we communicate with our content scripts.
chrome.runtime.onConnect.addListener(handleMessaging);

//this is our extension icon click response
chrome.action.onClicked.addListener(onClickWorker);

// this should repeatedly run the get-links script until it is complete
// chrome.tabs.onUpdated.addListener(handleJobLinksTab(tabId, changeInfo, tab));
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await handleJobLinksTab(tabId, changeInfo, tab);
});
chrome.webNavigation.onTabReplaced.addListener(
  async () => await handleJobLinksWebNav()
);
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleJobLinksWebNav(),
  jobLinkFilters
);
