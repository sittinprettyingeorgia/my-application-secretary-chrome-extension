/*****************************************
 *
 * CONSTANTS
 ******************************************/
const INDEED_BASE = 'https://www.indeed.com';

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
 * NAVIGATION
 ******************************************/
export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

// Event types
const MOUSE = {
  CLICK: 'click',
  DOWN: 'mousedown',
  OVER: 'mouseover',
  UP: 'mouseup',
};

const HTML_ELEMENT = {
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
