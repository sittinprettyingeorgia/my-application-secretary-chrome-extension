/*****************************************
 *
 * CONSTANTS
 ******************************************/
const INDEED_BASE = 'https://www.indeed.com';
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

  chrome.storage.sync.set({ [key]: val }, () => {
    //console.log('Value is set to ' + JSON.stringify(val));
  });

  console.log('Successfully stored information');
};
export const setStorageLocalData = async (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.local.set({ [key]: val }, () => {
    console.log('Value is set to ' + JSON.stringify(val));
  });

  console.log('Successfully stored information');
};

/*****************************************
 *
 * EVENT HANDLING
 ******************************************/
const triggerMouseEvent = (node, eventType) => {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

const simulateApplyNow = (applyNowButton) => {
  for (const event of Object.values(MOUSE)) {
    triggerMouseEvent(applyNowButton, event);
  }
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
      case 'apply-now':
        JOB_POSTING_WORKER.handleApplyNowMessaging(msg, port, messageId);
        break;
      default:
        console.log('waiting for message', msg);
    }
  });
};

/*****************************************
 *
 * NAVIGATION
 ******************************************/
export const REGEX = {
  CONTAINS_JOB_POSTING: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
  JOB_POSTING_URL: 'indeed.com/viewjob',
  CONTAINS_JOB_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
  CONTAINS_JOBS_LINKS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
  JOB_LINK_URL: 'indeed.com/jobs',
  JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=7',
};

export const handleTabChange = async () => {
  //TODO: all local storage calls should be replace by our rest api
  const appInfo = {
    ...(await getAllStorageLocalData('indeed').then((items) => items)),
  };

  let tab = await getCurrentTab();

  if (tab.url) {
    const getLinks =
      tab.url.match(REGEX.JOB_LINK_URL) &&
      appInfo?.indeed?.user?.jobLinkCollectionInProgress;
    const applyNow =
      tab.url.match(REGEX.JOB_POSTING_URL) &&
      appInfo?.indeed?.user?.applyNowInProgress;

    if (getLinks) {
      handleNavigation('get-links', tab.id);
    } else if (applyNow) {
      handleNavigation('apply-now', tab.id);
    }
  }
};

export const handleNavigation = (action, tabId) => {
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

export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

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

/**
 * Remove a link from our users jobLinks
 * @param {key:href, val:href} links
 */
export const deleteHref = async (hrefToBeDeleted) => {
  try {
    const appInfo = {
      ...(await getAllStorageLocalData('indeed').then((items) => items)),
    };

    if (!appInfo?.indeed?.user) {
      throw new Error('Please create a user');
    } else if (
      !appInfo.indeed.user?.jobLinks ||
      appInfo.indeed.user?.jobLinks.length < 1
    ) {
      throw new Error('No job links stored');
    }

    const user = appInfo.indeed.user;
    const jobLinks = user.jobLinks;
    jobLinks.sort();
    jobLinks.pop();
    user.jobLinks = [...jobLinks];

    await setStorageLocalData('indeed', {
      applicationName: 'indeed',
      user,
    });
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
 * JOB LINKS WORK
 ******************************************/
export const JOB_LINKS_WORKER = {
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
        console.log(msg.status);
        break;
      case 'connection received, starting job scan':
        console.log(msg.status);
        break;
      case 'waiting for message':
        console.log('script did not receive background message');
      case 'There was an error collecting job links':
        console.log(JSON.stringify(msg.data));
      default:
        console.log('waiting for actionable message...', msg);
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
      const appInfo = {
        ...(await getAllStorageLocalData('indeed').then((items) => items)),
      };

      if (!appInfo?.indeed?.user) {
        //TODO: window.location.replace('onboarding.html');
        throw new Error('Please create a user');
      } else if (
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
      console.log(e?.message);
      console.log(e);
    }
  },
  filter: {
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: 'viewjob' }],
  },
  handleJobPostingMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case 'connecting apply-now messenger':
        establishApplyNowConnection(msg, port, messageId);
        break;
      case 'job posting is not apply-now':
        deleteHref(msg.url);
        break;
      case 'completed apply-now':
        //content-script has scanned all applications; we can move on
        break;
      case 'connection received, handling job posting':
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
