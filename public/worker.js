const INDEED_SUFFIX = "indeed.com";
const INDEED_BASE = "https://www.indeed.com";
const INDEED = "indeed";
const GET_LINKS = "get-links";
const GET_LINKS_PATH = "./indeed/get-links.js";
const HANDLE_JOB_POSTING = "handle-job-posting";
const HANDLE_JOB_POSTING_PATH = "./indeed/handle-job-posting.js";
const HANDLE_JOB_FORM = "handle-job-form";
const HANDLE_JOB_FORM_PATH = "./indeed/handle-job-form.js";
const STORAGE_KEY = "indeed";

/*****************************************
 *
 * MESSAGING
 ******************************************/
// handleExtensionMessagingTo/From content scripts
export const handleMessaging = (port, socket, connectWSS) => {
  // Asynchronously retrieve data from storage.sync, then cache it.
  // Generate a random 4-char key to avoid clashes if called multiple times
  let messageId = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

  if (socket?.readyState === WebSocket?.OPEN) {
    socket.send("test1");
  } else {
    connectWSS();
    socket.send("test2");
  }

  port.onMessage.addListener(async (msg) => {
    switch (port.name) {
      case "my-application-secretary":
        MY_APP_SEC_WORKER.handleMyAppSecMessaging(msg, port, messageId);
        break;
      case "get-links":
        JOB_LINKS_WORKER.handleJobLinkMessaging(msg, port, messageId);
        break;
      case "handle-job-posting":
        JOB_POSTING_WORKER.handleJobPostingMessaging(msg, port, messageId);
        break;
      case "handle-job-form":
        JOB_FORM_WORKER.handleJobFormMessaging(msg, port, messageId);
        break;
      default:
        console.log("waiting for message", msg);
    }
  });
};

/*****************************************
 *
 * STORAGE
 ******************************************/
const getAllStorageLocalData = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      resolve(items);
    });
  });
};

const setStorageLocalData = async (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.local.set({ [key]: val }, () => {});
};

/*****************************************
 *
 * HELPERS
 ******************************************/
/**
 * Remove a link from our users jobLinks
 * @param {key:href, val:href} links
 */
const deleteHrefAndGoToNext = async () => {
  try {
    const [appInfo, _tab] = await getTabAndAppInfo();

    if (
      !appInfo.indeed.user?.jobLinks ||
      appInfo.indeed.user?.jobLinks.length < 1
    ) {
      throw new Error("No job links stored");
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
    console.log("could not retrieve application information");
    console.log(e);
  }
};

const updateAppInfo = async (newAppInfo) => {
  let questions;
  try {
    const appInfo = await getAppInfo();
    appInfo.indeed.user.currentAppInfo = { ...newAppInfo };

    const response = await fetch(newAppInfo.questions);
    appInfo.indeed.user.currentQuestions = { ...(await response.json()) };
    console.log(JSON.stringify(appInfo.indeed.user.currentQuestions));
  } catch (e) {
    // log error
  }

  if (questions) {
    let answers;
    try {
      const answerResponse = await fetch("/1/answers", {
        method: "POST",
        method: "cors",
        body: JSON.stringify({ questions }),
      });
      appInfo.indeed.user.currentAnswers = { ...(await answerResponse.json()) };
    } catch (e) {
      //log error
    }

    await setStorageLocalData(STORAGE_KEY, {
      applicationName: STORAGE_KEY,
      user: { ...appInfo.indeed.user },
    });
  }
};

const getAppInfo = async () => {
  const appInfo = {
    ...(await getAllStorageLocalData(INDEED).then((items) => items)),
  };

  if (!appInfo?.indeed?.user) {
    //TODO: window.location.replace('onboarding.html');
    throw new Error("Please create a user");
  }

  return appInfo;
};

const getCurrentTab = async () => {
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

const establishConnection = (msg, fields) => {
  const { port, ...otherFields } = fields ?? {};

  console.log(msg.status);
  port.postMessage({ response: "connected", ...otherFields });
};

/*****************************************
 *
 * JOB-FORM
 ******************************************/
export const JOB_FORM_WORKER = {
  main: async (tab) => {
    try {
      const [appInfo, _tab] = await getTabAndAppInfo();
      console.log("I am running script inside of indeed form HOE!");
    } catch (e) {
      console.log(e);
    }
  },
  filter: {
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: "beta" }],
  },
  handleJobFormMessaging: async (msg, port, messageId) => {
    const appInfo = await getAppInfo();

    switch (msg.status) {
      case "connecting handle-job-form messenger":
        establishConnection(msg, { port, messageId, appInfo });
        break;
      case "completed handle-job-form":
        //content-script has completed job form
        break;
      case "connection received, handling job form":
        console.log(msg.status);
        break;
      case "waiting for message":
        console.log("script did not receive background message");
      default:
        console.log(msg.debug);
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
        throw new Error("There are no job links available");
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
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: "viewjob" }],
  },
  handleJobPostingMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case "connecting handle-job-posting messenger":
        establishConnection(msg, { port, messageId });
        break;
      case "job posting is not valid": //TODO: we cannot get messages from content script apply-now
        deleteHrefAndGoToNext();
        break;
      case "completed handle-job-posting":
        //content-script has scanned all applications; we can move on
        break;
      case "current app-info":
        updateAppInfo(msg.data);
        break;
      case "connection received, handling job posting":
        break;
      case "waiting for message":
        break;
      default:
    }
  },
};

/*****************************************
 *
 * JOB LINKS WORK
 ******************************************/
export const JOB_LINKS_WORKER = {
  main: async () => {
    try {
      let mockInfo = {
        user: {
          userId: "1",
          firstName: "Mitchell",
          lastName: "Blake",
          jobLinks: [],
          jobPreferences: {
            jobLinksLimit: 60,
          },
          jobLinkCollectionInProgress: true,
        },
      };

      //TODO: all local storage calls should be replace by our rest api
      await setStorageLocalData("indeed", mockInfo);
      let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=7`;
      await chrome.tabs.create({ url });
    } catch (e) {
      console.log(e);
    }
  },
  filter: {
    url: [{ hostSuffix: INDEED_SUFFIX, pathContains: "jobs" }],
  },
  handleJobLinkMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case "connecting job-links messenger":
        establishConnection(msg, { port, messageId });
        break;
      case "completed job-links scan":
        // content-script has scanned all job pages and stored info
        // we can move on to apply now
        break;
      case "connection received, starting job scan":
        break;
      case "waiting for message":
        break;
      default:
    }
  },
};

/*****************************************
 *
 * MY APPLICATION SECRETARY
 ******************************************/
export const MY_APP_SEC_WORKER = {
  handleMyAppSecMessaging: (msg, port, messageId) => {
    switch (msg.status) {
      case "connecting my-application-secretary messenger":
        establishConnection(msg, { port, messageId });
        break;
      case "start applying":
        // user has clicked the start applying button
        startApplying(msg, { port, messageId });
        break;
      case "waiting for message":
        break;
      default:
    }
  },
};
