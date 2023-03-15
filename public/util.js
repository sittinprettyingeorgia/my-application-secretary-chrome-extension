/*****************************************
 *
 * CONSTANTS
 ******************************************/
const INDEED_BASE = "https://www.indeed.com";
const INDEED = "indeed";
const GET_LINKS = "get-links";
const GET_LINKS_PATH = "./indeed/get-links.js";
const HANDLE_JOB_POSTING = "handle-job-posting";
const HANDLE_JOB_POSTING_PATH = "./indeed/handle-job-posting.js";
const HANDLE_JOB_FORM = "handle-job-form";
const HANDLE_JOB_FORM_PATH = "./indeed/handle-job-form.js";
const STORAGE_KEY = "indeed";
export const INDEED_SUFFIX = "indeed.com";

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
const getAxiosError = (e) => {
  let message = "";
  let err;

  if (e.response) {
    message =
      "The request was made and the server responded with a status code that falls out of the range of 2xx";
    err = { message, ...e.response };
  } else if (e.request) {
    message = "The request was made but no response was received";
    err = { message, ...e.request };
  } else {
    message =
      "Something happened in setting up the request that triggered an error";
    err = { message };
  }

  return err;
};

const getAppInfo = async () => {
  const appInfo = {
    ...(await getAllStorageLocalData(INDEED)),
  };

  if (!appInfo?.indeed?.user) {
    //TODO: window.location.replace('onboarding.html');
    throw new Error("Please create a user");
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

export const establishConnection = (msg, fields) => {
  const { port, ...otherFields } = fields ?? {};

  console.log(msg.status);
  port.postMessage({ response: "connected", ...otherFields });
};

/*****************************************
 *
 * EVENT HANDLING
 ******************************************/
// Event types
export const MOUSE = {
  CLICK: "click",
  DOWN: "mousedown",
  OVER: "mouseover",
  UP: "mouseup",
};

export const HTML_ELEMENT = {
  BUTTON: "button",
};

const triggerMouseEvent = (node, eventType) => {
  var clickEvent = document.createEvent("MouseEvents");
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
  JOB_FORM_URL: "https://m5.apply.indeed.com/",
  JOB_LINK_URL: "indeed.com/jobs",
  JOB_POSTING_URL: "indeed.com/viewjob",
  JOB_WINDOW: "https://www.indeed.com/jobs?q=software&l=Remote&fromage=7",
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
