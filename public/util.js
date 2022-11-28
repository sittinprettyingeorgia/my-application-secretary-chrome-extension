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
/*let myWindow = window.location.href;
      
            if (myWindow.search(REGEX.CONTAINS_JOBS) < 0) {
              // TODO: this url should be updated later to be dynamic based on user preferences.
              let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=${jobPostingPreferredAge}`;
              window.location.replace(url);
            }*/
