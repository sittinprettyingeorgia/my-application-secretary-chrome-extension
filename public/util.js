// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then((items) => {
  // Where we will expose all the data we retrieve from storage.sync.
  const storageCache = {};
  // Copy the data retrieved from storage into storageCache.
  return Object.assign(storageCache, items);
});

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
const getAllStorageSyncData = () => {
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items);
    });
  });
};

const storageCache = {};
chrome.action.onClicked.addListener(async (tab) => {
  try {
    storageCache = await initStorageCache;
  } catch (e) {
    // Handle error that occurred during storage initialization.
  }
  // Normal action handler logic.
});

export { storageCache };
