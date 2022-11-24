// Asynchronously retrieve data from storage.sync, then cache it.
export const initStorageCache = getAllStorageSyncData().then((items) => {
  // Where we will expose all the data we retrieve from storage.sync.
  // Copy the data retrieved from storage into storageCache.
  return { ...items };
});

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

//TODO add handler for messaging to different content scripts
export const handleBackgroundMessaging = (msg) => {
    switch (msg.status) {
        case 'connecting to messenger':
          port.postMessage({ response: 'connected' });
          break;
        case 'finished collecting links'
          // helper function that stores our links
          break;
      }
}

/**
 * Sets current application information to local storage to use during form
 */
export const setStorage = async (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.sync.set({ [key]: val }, () => {
    console.log('Value is set to ' + JSON.stringify(val));
  });

  console.log('Successfully stored information');
};
