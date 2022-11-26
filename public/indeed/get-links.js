const DEFAULTS = {
  limit: 600,
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

//APPLY NOW CONSTANTS | apply-now.js
const REGEX = {
  CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
  CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
  CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
  JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14',
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

/**
 * Retrieve an list of elements using a query selector
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
const retrieveElems = (selector) => {
  return document.querySelectorAll(selector);
  //return document.querySelector(selector);
};

/**
 * Retrieve an element using a query selector
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
const retrieveElem = (selector) => {
  return document.querySelector(selector);
};

const click = (elem) => {
  elem.click();
};

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

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

/**
 * crawls pages and collects job links
 */
const collectLinks = async (user, port, messageId) => {
  let { jobLinks = {}, jobPostingPreferredAge = 14, jobLinksLimit = 600 } =
    user ?? {};

  const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };
  const newJobLinks = { ...jobLinks };

  const gotoNextPage = () => {
    const nav = document.querySelector(INDEED_QUERY_SELECTOR.NAV_CONTAINER);
    nav?.scrollIntoView();

    const paginationNext = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM1);
    const paginationNext2 = retrieveElem(
      INDEED_QUERY_SELECTOR.PAGINATION_ELEM2
    );

    if (paginationNext !== null) {
      click(paginationNext);
    } else if (paginationNext2 !== null) {
      click(paginationNext2);
    }
  };

  const getPageJobLinks = async (user) => {
    try {
      let myWindow = window.location.href;

      if (myWindow.search(REGEX.CONTAINS_JOBS) < 0) {
        // TODO: this url should be updated later to be dynamic based on user preferences.
        let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=${jobPostingPreferredAge}`;
        window.location.replace(url);
      }

      const links = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);
      for (const link of links) {
        const href = link.getAttribute(HREF);

        if (href) {
          newJobLinks[href] = href;
        }

        if (newJobLinks.length > 30) {
          break;
        }
      }

      console.log('finished page scan');
      gotoNextPage();
    } catch (e) {
      console.log('script failed', e);
      throw new Error('script failed');
    }
  };

  try {
    let limit = 30;

    while (!newJobLinks || Object.keys(newJobLinks)?.length < limit) {
      await getPageJobLinks();
    }

    console.log('finished collecting links');
    result.jobLinks = newJobLinks;
  } catch (x) {
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
const setStorageLocalData = async (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.local.set({ [key]: val }, () => {
    console.log('Value is set to ' + JSON.stringify(val));
  });
};

/**
 * Collect all available job application links.
 */
const handleJobLinksRetrieval = async (port, messageId) => {
  // Asynchronously retrieve data from storage.sync, then cache it.
  let appInfo = {};

  try {
    appInfo = {
      ...(await getAllStorageLocalData('indeed').then((items) => items)),
    };

    if (!appInfo?.indeed?.user) {
      //TODO: we still need to create onboarding
      window.location.replace('onboarding.html');
      throw new Error('Please create a user');
    }
  } catch (e) {
    // Handle error that occurred during storage initialization.
    console.log('could not retrieve application information');
    console.log(e);
  }

  const user = appInfo?.indeed?.user;
  const data = await collectLinks(user, port, messageId);
  port.postMessage({ status: 'completed job scan' });
  setStorageLocalData('indeed', { ...data });
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
    status: 'connection received, starting job scan',
  });

  //messaging works but handleJobLinksRetrieval is failing
  await handleJobLinksRetrieval(port, msg.messageId);
};

let port = chrome.runtime.connect({ name: 'get-links' });
port.postMessage({ status: 'connecting job-links messenger' });
port.onMessage.addListener(async (msg) => {
  switch (msg.response) {
    case 'connected':
      await handleConnectedAction(port, msg);
      break;
    case 'waiting for message':
      console.log('background did not receive background message');
    default:
      port.postMessage({ status: 'waiting for message...' });
  }
});
