export const DEFAULTS = {
  limit: 600,
};
export const HREF = 'href';
export const INDEED = 'indeed';
// Event types
export const MOUSE = {
  CLICK: 'click',
  DOWN: 'mousedown',
  OVER: 'mouseover',
  UP: 'mouseup',
};

export const HTML_ELEMENT = {
  BUTTON: 'button',
};

//APPLY NOW CONSTANTS | apply-now.js
export const REGEX = {
  CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
  CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
  CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
  JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14',
};

export const INDEED_QUERY_SELECTOR = {
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
export const retrieveElems = (selector) => {
  return document.querySelectorAll(selector);
  //return document.querySelector(selector);
};

/**
 * Retrieve an element using a query selector
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export const retrieveElem = (selector) => {
  return document.querySelector(selector);
};

export const click = async (elem) => {
  elem.click();
};

export const triggerMouseEvent = (node, eventType) => {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

export const simulateApplyNow = (applyNowButton) => {
  for (const event of Object.values(MOUSE)) {
    triggerMouseEvent(applyNowButton, event);
  }
};

export const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

/**
 * crawls pages and collects job links
 */
const collectLinks = async (user, messageId) => {
  console.log('inside collect links');
  let { jobLinks = {}, jobPostingPreferredAge = 14, jobLinksLimit = 600 } =
    user ?? {};

  const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };
  const newJobLinks = { ...jobLinks };

  const gotoNextPage = async () => {
    const nav = document.querySelector(INDEED_QUERY_SELECTOR.NAV_CONTAINER);
    nav?.scrollIntoView();

    const paginationNext = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM1);
    const paginationNext2 = retrieveElem(
      INDEED_QUERY_SELECTOR.PAGINATION_ELEM2
    );

    if (paginationNext !== null) {
      await click(paginationNext);
    } else if (paginationNext2 !== null) {
      await click(paginationNext2);
    }
  };

  const getPageJobLinks = async (user) => {
    try {
      // TODO: this url should be updated later to be dynamic based on user preferences.
      let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=${jobPostingPreferredAge}`;
      await chrome.tabs.create({ url });
      //port.postMessage({ status: 'started scanning page' });
      console.log('started scanning page');
      const links = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);
      links?.forEach((link) => {
        const href = link.getAttribute(HREF);
        if (href) {
          newJobLinks[href] = href;
        }
      });

      console.log('finished scanning page');
      await gotoNextPage();
    } catch (e) {
      console.log('script failed', e);
      throw new Error('script failed');
    }
  };

  try {
    console.log('about to while loop');
    while (!newJobLinks || Object.keys(newJobLinks)?.length < jobLinksLimit) {
      console.log('link collection in progress');
      await getPageJobLinks();
    }

    console.log('finished collecting links');
    result.newJobLinks = newJobLinks;
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

/**
 * Collect all available job application links.
 */
const handleJobLinksRetrieval = async () => {
  console.log('inside handle job links retrieval');
  // Asynchronously retrieve data from storage.sync, then cache it.
  let appInfo = {};

  try {
    appInfo = {
      ...(await getAllStorageSyncData('indeed').then((items) => items)),
    };

    console.log('Retrieved app info', JSON.stringify(appInfo));

    if (!appInfo?.indeed?.user) {
      await chrome.tabs.create({ url: 'onboarding.html' });
      throw new Error('Please create a user');
    }
  } catch (e) {
    // Handle error that occurred during storage initialization.
    console.log('could not retrieve application information');
    console.log(e);
  }

  console.log('success info retrieval');
  console.log('about to execute script');
  const user = appInfo?.indeed?.user;
  console.log('USER', appInfo?.indeed?.user);
  const result = await collectLinks(user, messageId);
  console.log('executed script result =', result);
};

/*********************************
 *
 *
 * Content script Main
 *
 *
 *
 *********************************/

let port;

const connectMessenger = async () => {
  port = chrome.runtime.connect({ name: 'get-links' });
  port.postMessage({ status: 'connecting to messenger' });
  port.onMessage.addListener(function(msg) {
    console.log(JSON.stringify(msg));
    switch (msg.response) {
        case 'connected':
            //we can now paass data
          port.postMessage({ response: 'connected' });
          break;
        case 'finished collecting links'
          // helper function that stores our links 
          break;
      }
  });
};

// currently we wait a second for background.js to setup its messaging connection.
// should create a better solution for this.
setTimeout(() => connectMessenger, 1000);
