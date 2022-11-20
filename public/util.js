// Asynchronously retrieve data from storage.sync, then cache it.
export const initStorageCache = getAllStorageSyncData().then((items) => {
  // Where we will expose all the data we retrieve from storage.sync.
  const storageCache = {};
  // Copy the data retrieved from storage into storageCache.
  return Object.assign(storageCache, items);
});

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
export const getAllStorageSyncData = (key) => {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(key, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
};

/**
 * Add to our local storage
 * @param newLinks
 */
export const setStorage = (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.sync.set({ key: val }, () => {
    console.log('Value is set to ' + val);
  });
};
