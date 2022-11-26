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

export const handleMockInfo = () => {
  return {
    applicationName: 'indeed',
    user: {
      userId: '1',
      jobLinksLimit: 600,
      firstName: 'Mitchell',
      lastName: 'Blake',
      jobLinks: {},
      jobPostingPreferredAge: 7,
    },
  };
};

export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
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
    //console.log('Value is set to ' + JSON.stringify(val));
  });

  console.log('Successfully stored information');
};
