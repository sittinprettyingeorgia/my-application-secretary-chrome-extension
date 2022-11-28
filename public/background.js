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
// establish a connection with a job-link content-script
const establishJobLinkConnection = (msg, port, messageId) => {
  console.log(msg.status);
  port.postMessage({ response: 'connected', messageId });
};
// retrieve job links for a user
const handleJobLinksTab = async (tabId, changeInfo, tab) => {
  const appInfo = {
    ...(await getAllStorageLocalData('indeed').then((items) => items)),
  };
  console.log('(handleJobLinksTab) inside');
  console.log('(handleJobLinksTab)tab:', JSON.stringify(tab));
  console.log('(handleJobLinksTab) appInfo:', JSON.stringify(appInfo));
  console.log(
    '(handleJobLinksTab)collection in progress',
    appInfo?.indeed?.user?.jobLinkCollectionInProgress
  );
  if (changeInfo.status === 'complete' && tab.url) {
    if (
      tab.url.match('indeed.com/jobs') &&
      appInfo?.indeed?.user?.jobLinkCollectionInProgress
    ) {
      console.log('(handleJobLinksTab) job-links page condition met');
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['./indeed/get-links.js'],
      });
    }
  }
};
// retrieve job links for a user
const handleJobLinksWebNav = async () => {
  const appInfo = {
    ...(await getAllStorageLocalData('indeed').then((items) => items)),
  };

  let tab = await getCurrentTab();
  console.log('(handleJobLinksWebNav)inside ');
  console.log('(handleJobLinksWebNav)tab:', JSON.stringify(tab));
  console.log('(handleJobLinksWebNav) appInfo:', JSON.stringify(appInfo));
  console.log(
    '(handleJobLinksWebNav)collection in progress',
    appInfo?.indeed?.user?.jobLinkCollectionInProgress
  );
  if (
    tab.url.match('indeed.com/jobs') &&
    appInfo?.indeed?.user?.jobLinkCollectionInProgress
  ) {
    console.log('(handleJobLinksWebNav)job-links page condition met');
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./indeed/get-links.js'],
    });
  }
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
    switch (msg.status) {
      case 'connecting job-links messenger':
        establishJobLinkConnection(msg, port, messageId);
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
  });
};
/*****************************************
 *
 * SERVICE WORKER
 ******************************************/
const onClickWorker = async (tab) => {
  try {
    let mockInfo = {
      applicationName: 'indeed',
      user: {
        userId: '1',
        jobLinksLimit: 600,
        firstName: 'Mitchell',
        lastName: 'Blake',
        jobLinks: { 'https://testlink.com': 'https://testlink.com' },
        jobPostingPreferredAge: 7,
        jobLinkCollectionInProgress: true,
      },
    };
    await setStorageLocalData('indeed', mockInfo);
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
//chrome.tabs.onUpdated.addListener(handleJobLinksTab(tabId, changeInfo, tab));

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('tabId', tabId);
  console.log('changeInfo', JSON.stringify(changeInfo));
  console.log('tab', JSON.stringify(tab));
  await handleJobLinksTab(tabId, changeInfo, tab);
});
chrome.webNavigation.onTabReplaced.addListener(
  async () => await handleJobLinksWebNav()
);
chrome.webNavigation.onHistoryStateUpdated.addListener(
  async () => await handleJobLinksWebNav(),
  jobLinkFilters
);
