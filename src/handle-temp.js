let appInfo = {};
const STORAGE_KEY = 'indeed';
const COMPLETED = 'completed job-posting scan';
// application button text variations
const APPLY = {
  NOW: 'Apply now',
  APPLIED: 'Applied',
  COMPANY_SITE: 'Apply on company site',
};
const INDEED_QUERY_SELECTOR = {
  APPLY_BUTTON: '.ia-IndeedApplyButton',
  APPLY_BUTTON_ID: '#indeedApplyButton',
  APPLY_BUTTON_WRAPPER: '.jobsearch-IndeedApplyButton-buttonWrapper',
  APPLY_WIDGET: '.indeed-apply-widget',
  JOB_LINKS: '.jobTitle a',
  NAV_CONTAINER: 'nav[role=navigation',
  PAGINATION_ELEM1: 'a[data-testid=pagination-page-next]',
  PAGINATION_ELEM2: 'a[aria-label=Next]',
};
const APP_INFO = {
  apiToken: 'apitoken',
  advNum: 'advnum',
  continueUrl: 'continueurl',
  coverletter: 'coverletter',
  jobUrl: 'joburl',
  postUrl: 'posturl',
  questions: 'questions',
  jK: 'jk',
  jobCompany: 'jobcompanyname',
  jobId: 'jobid',
  jobLocation: 'joblocation',
  jobTitle: 'jobtitle',
  noButtonUI: 'nobuttonui',
  onAppliedStatus: 'onappliedstatus',
  onReady: 'onready',
  phone: 'phone',
  pingbackUrl: 'pingbackurl',
  recentSearchQuery: 'recentsearchquery',
  resume: 'resume',
};
const PREFIX = 'data-indeed-apply-';
// Event types
const MOUSE = {
  OVER: 'mouseover',
  DOWN: 'mousedown',
  UP: 'mouseup',
  CLICK: 'click',
};

const HTML_ELEMENT = {
  BUTTON: 'button',
};

const triggerMouseEvent = (node, eventType) => {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

const simulateApplyNow = (applyNowButton) => {
  triggerMouseEvent(applyNowButton, MOUSE.OVER);
  triggerMouseEvent(applyNowButton, MOUSE.DOWN);
  triggerMouseEvent(applyNowButton, MOUSE.UP);
  triggerMouseEvent(applyNowButton, MOUSE.CLICK);
};

const handleApplyNowNotFound = (elem) => {
  if (!elem || elem.textContent !== APPLY.NOW) {
    throw new Error('Job posting is not apply-now');
  }

  return elem;
};
const getAllStorageLocalData = (key) => {
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
 * Return the apply to job button which may have three values:  EX.(Apply now, Applied, or Apply on company site)
 * @param currentUrl the current href value from our links object.
 * @throws Exception if this button is not an Apply Now Button.
 * @returns
 */
const getApplyButton = () => {
  const tryId = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON_WRAPPER)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON_ID);

  const tryButton = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(
      `${INDEED_QUERY_SELECTOR.APPLY_WIDGET} ${HTML_ELEMENT.BUTTON}`
    );

  return handleApplyNowNotFound(tryId) ?? handleApplyNowNotFound(tryButton);
};

const sendScanCompleteMessage = async () => {
  const user = appInfo?.indeed?.user;
  user.jobPostingInProgress = false;
  user.currentAppInfo = appInfo;

  await setStorageLocalData(STORAGE_KEY, {
    applicationName: STORAGE_KEY,
    user: { ...user },
  });
};

const click = async (elem) => {
  await sendScanCompleteMessage();
  try {
    simulateApplyNow(elem);
  } catch (e) {
    //chrome doesn't like the form click
  }
};

/**
 * Retrieves information about our current job application from webpage
 *
 * @param {string} currentUrl : an href string of the current job application.
 * @returns {object} currentAppInfo : an object containing all information about the job application
 */
const getAppInfo = () => {
  const applyWidget = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_WIDGET);

  const currentAppInfo = {}; //All information of our application should be stored here.

  for (const [camelCaseValues, lowerCaseValues] of Object.entries(APP_INFO)) {
    let appVal = applyWidget?.getAttribute(`${PREFIX}${lowerCaseValues}`); //try all lowercase vals

    if (!appVal) {
      appVal = applyWidget?.getAttribute(`${PREFIX}${camelCaseValues}`); //try camelcase vals
    }

    if (appVal) {
      currentAppInfo[lowerCaseValues] = appVal;
    }
  }

  return currentAppInfo;
};

const validateApplyNow = async (user, port, messageId) => {
  let { jobLinks = [] } = user ?? {};
  const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };
  try {
    let applyNowButton;
    try {
      const appInfo = getAppInfo();
      applyNowButton = getApplyButton(port);
      port.postMessage({ status: 'debug', debug: window.location.href });
      //await click(applyNowButton);
    } catch (e) {
      //this is not an apply now job posting
      const status = 'job posting is not apply-now';
      port.postMessage({ status });
    }
  } catch (e) {
    // Make an explicit copy of the Error properties
    result.error = {
      message: x.message,
      arguments: x.arguments,
      type: x.type,
      name: x.name,
      stack: x.stack,
    };
  }

  return result;
};

const handleJobPosting = async (port, messageId) => {
  // Asynchronously retrieve data from storage.sync, then cache it.
  try {
    appInfo = {
      ...(await getAllStorageLocalData('indeed').then((items) => items)),
    };

    if (!appInfo?.indeed?.user) {
      //TODO: we still need to create onboarding
      window.location.replace('onboarding.html');
      //TODO: wee need to wait until our onboarding site is loaded
      throw new Error('Please create a user');
    }
  } catch (e) {
    // Handle error that occurred during storage initialization.
    console.log('could not retrieve application information');
    console.log(e);
    port.postMessage({ status: 'debug', debug: e });
  }

  const user = appInfo?.indeed?.user;
  await validateApplyNow(user, port, messageId);
};

/*********************************
 *
 *
 * Content script Main
 *
 *
 *
 *********************************/
const handleConnectedAction = async (port, msg) => {
  port.postMessage({
    status: 'connection received, handling job posting',
  });

  await handleJobPosting(port, msg.messageId);
};
