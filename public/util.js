/*****************************************
 *
 * CONSTANTS
 ******************************************/
const INDEED_BASE = 'https://www.indeed.com';
const INDEED = 'indeed';
const GET_LINKS = 'get-links';
const GET_LINKS_PATH = './indeed/get-links.js';
const HANDLE_JOB_POSTING = 'handle-job-posting';
const HANDLE_JOB_POSTING_PATH = './indeed/handle-job-posting.js';
const HANDLE_JOB_FORM = 'handle-job-form';
const HANDLE_JOB_FORM_PATH = './indeed/handle-job-form.js';
export const INDEED_SUFFIX = 'indeed.com';
/*****************************************
 *
 * DATA STORAGE
 ******************************************/
/**
 * Returns some stored information for a user
 *
 * @param {string} key the key for our stored object
 * @returns
 */
export const getAllStorageSyncData = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(items);
    });
  });
};
export const getAllStorageLocalData = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(items);
    });
  });
};

/**
 * Sets current application information to local storage to use during form
 */
export const setStorageSyncData = async (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.sync.set({ [key]: val }, () => {});
};
export const setStorageLocalData = async (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.local.set({ [key]: val }, () => {});
};
/*****************************************
 *
 * HELPER
 ******************************************/
const getAppInfo = async () => {
  const appInfo = {
    ...(await getAllStorageLocalData(INDEED).then((items) => items)),
  };

  if (!appInfo?.indeed?.user) {
    //TODO: window.location.replace('onboarding.html');
    throw new Error('Please create a user');
  }

  return appInfo;
};
export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};
const getTabAndAppInfo = async () => {
  const appInfo = await getAppInfo();
  const tab = await getCurrentTab();
  return [appInfo, tab];
};
/**
 * Remove a link from our users jobLinks
 * @param {key:href, val:href} links
 */
export const deleteHrefAndGoToNext = async () => {
  try {
    const [appInfo, _tab] = await getTabAndAppInfo();

    if (
      !appInfo.indeed.user?.jobLinks ||
      appInfo.indeed.user?.jobLinks.length < 1
    ) {
      throw new Error('No job links stored');
    }

    const user = appInfo.indeed.user;
    const jobLinks = [...user.jobLinks];
    jobLinks.sort();
    jobLinks.pop();
    user.jobLinks = [...jobLinks];

    await setStorageLocalData(INDEED, {
      applicationName: INDEED,
      user,
    });

    let url = INDEED_BASE + jobLinks.pop();
    await chrome.tabs.create({ url });
  } catch (e) {
    // Handle error that occurred during storage initialization.
    console.log('could not retrieve application information');
    console.log(e);
  }
};

export const establishConnection = (msg, fields) => {
  const { port, ...otherFields } = fields ?? {};

  console.log(msg.status);
  port.postMessage({ response: 'connected', ...otherFields });
};

/*****************************************
 *
 * EVENT HANDLING
 ******************************************/
// Event types
export const MOUSE = {
  CLICK: 'click',
  DOWN: 'mousedown',
  OVER: 'mouseover',
  UP: 'mouseup',
};

export const HTML_ELEMENT = {
  BUTTON: 'button',
};

const triggerMouseEvent = (node, eventType) => {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

const simulateClick = (applyNowButton) => {
  for (const event of Object.values(MOUSE)) {
    triggerMouseEvent(applyNowButton, event);
  }
};

const click = async (elem) => {
  simulateClick(elem);
};

/*****************************************
 *
 * NAVIGATION
 ******************************************/
export const REGEX = {
  CONTAINS_JOB_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
  CONTAINS_JOB_POSTING: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
  CONTAINS_JOBS_LINKS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
  JOB_FORM_URL: 'https://m5.apply.indeed.com/',
  JOB_LINK_URL: 'indeed.com/jobs',
  JOB_POSTING_URL: 'indeed.com/viewjob',
  JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=7',
};

export const handleTabChange = async () => {
  //TODO: all local storage calls should be replace by our rest api
  const [appInfo, tab] = await getTabAndAppInfo();
  const jobLinkCollectionInProgress =
    appInfo?.indeed?.user?.jobLinkCollectionInProgress;
  const jobPostingInProgress = appInfo?.indeed?.user?.jobPostingInProgress;

  if (tab?.url && (jobLinkCollectionInProgress || jobPostingInProgress)) {
    const getLinks =
      tab.url.match(REGEX.JOB_LINK_URL) && jobLinkCollectionInProgress;

    const handleJobPosting =
      tab.url.match(REGEX.JOB_POSTING_URL) && jobPostingInProgress;

    const handleJobForm =
      tab.url.match(REGEX.JOB_FORM_URL) && jobPostingInProgress;

    if (getLinks) {
      handleNavigation(GET_LINKS, tab.id);
    } else if (handleJobPosting) {
      handleNavigation(HANDLE_JOB_POSTING, tab.id);
    } else if (handleJobForm) {
      handleNavigation(HANDLE_JOB_FORM, tab.id);
    }
  }
};

export const handleNavigation = (action, tabId) => {
  const navigateToJobLinksScript = async () => {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [GET_LINKS_PATH],
    });
  };

  const navigateToApplyNowScript = async () => {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [HANDLE_JOB_POSTING_PATH],
    });
  };

  const navigateToFormScript = async () => {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [HANDLE_JOB_FORM_PATH],
    });
  };

  switch (action) {
    case GET_LINKS:
      navigateToJobLinksScript();
      break;
    case HANDLE_JOB_POSTING:
      navigateToApplyNowScript();
      break;
    case HANDLE_JOB_FORM:
      navigateToFormScript();
      break;
  }
};

/*****************************************
 *
 * JOB LINKS WORK
 ******************************************/
export const JOB_LINKS_WORKER = {
  main: async () => {
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
      console.log(e);
    }
  },
  filter: {
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: 'jobs' }],
  },
  handleJobLinkMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case 'connecting job-links messenger':
        establishConnection(msg, { port, messageId });
        break;
      case 'completed job-links scan':
        //content-script has scanned all job pages and stored info
        //we can move on to apply now
        break;
      case 'connection received, starting job scan':
        break;
      case 'waiting for message':
        break;
      default:
    }
  },
};

/*****************************************
 *
 * JOB-POSTING
 ******************************************/
// base will need to be added to any links collected before being visited because
// all of our links are not full http links, they are paths ie. /my/path/1234365?as
export const JOB_POSTING_WORKER = {
  main: async (tab) => {
    try {
      const appInfo = getAppInfo();

      if (
        !appInfo?.indeed?.user?.jobLinks ||
        !appInfo?.indeed?.user?.jobLinks.length < 1
      ) {
        throw new Error('There are no job links available');
      }

      let jobLinks = appInfo.indeed.user.jobLinks;
      jobLinks.sort();
      //at returns the last link in our sorted job list but does not modify original array.
      // we need to remove this link after handleApplicationForm is successful.
      // or if the job is not an apply-now job
      let url = jobLinks.at(-1);
      await chrome.tabs.create({ url });
    } catch (e) {
      console.log(e);
    }
  },
  filter: {
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: 'viewjob' }],
  },
  handleJobPostingMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case 'connecting handle-job-posting messenger':
        establishConnection(msg, { port, messageId });
        break;
      case 'job posting is not apply-now': //TODO: we cannot get messages from content script apply-now
        deleteHrefAndGoToNext();
        break;
      case 'completed handle-job-posting':
        //content-script has scanned all applications; we can move on
        break;
      case 'app-info':
        break;
      case 'connection received, handling job posting':
        break;
      case 'waiting for message':
        break;
      default:
    }
  },
};

export const JOB_FORM_WORKER = {
  main: async (tab) => {
    try {
      const [appInfo, _tab] = await getTabAndAppInfo();
      console.log('I am running script inside of indeed form HOE!');
    } catch (e) {
      console.log(e);
    }
  },
  filter: {
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: 'beta' }],
  },
  handleJobFormMessaging: async (msg, port, messageId) => {
    const appInfo = await getAppInfo();

    switch (msg.status) {
      case 'connecting handle-job-form messenger':
        establishConnection(msg, { port, messageId, appInfo });
        break;
      case 'completed handle-job-form':
        //content-script has completed job form
        break;
      case 'connection received, handling job form':
        console.log(msg.status);
        break;
      case 'waiting for message':
        console.log('script did not receive background message');
      default:
        console.log(msg.debug);
    }
  },
};
/*****************************************
 *
 * MESSAGING
 ******************************************/
// handleExtensionMessagingTo/From content scripts
export const handleMessaging = (port) => {
  // Asynchronously retrieve data from storage.sync, then cache it.
  // Generate a random 4-char key to avoid clashes if called multiple times
  let messageId = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

  port.onMessage.addListener(async (msg) => {
    switch (port.name) {
      case 'get-links':
        JOB_LINKS_WORKER.handleJobLinkMessaging(msg, port, messageId);
        break;
      case 'handle-job-posting':
        JOB_POSTING_WORKER.handleJobPostingMessaging(msg, port, messageId);
        break;
      case 'handle-job-form':
        JOB_FORM_WORKER.handleJobFormMessaging(msg, port, messageId);
        break;
      default:
        console.log('waiting for message', msg);
    }
  });
};
