export const test = () => 'Test';

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

// local storage
export const KEYS = {
  APP_INFO: 'appInfo',
};

// application button text variations
export const APPLY = {
  NOW: 'Apply now',
  APPLIED: 'Applied',
  COMPANY_SITE: 'Apply on company site',
};

// query selector prefix combinations
export const PREFIX = 'data-indeed-apply-';
export const APP_INFO = {
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

//APP FORM CONSTANTS | handle-app-form.js
export const SUBMIT = {
  APPLICATION: 'Submit you application',
  BUTTON: '.ia-continueButton',
  CONTINUE: 'Continue',
  CONTINUE_SELECTOR: 'ia-continueButton',
  RETURN_TO_SEARCH_SELECTOR: '#returnToSearchButton',
  RETURN_TO_SEARCH: 'Return to job search',
  REVIEW_APPLICATION: 'Review you application',
};
export const QUESTIONS = {
  ADDRESS: 'Address',
  AGREE: 'agree',
  BEEN_EMPLOYED: 'Have you ever been employed by', // we need to add company name here.
  CITY: 'City',
  CLEARANCE: 'active security clearance',
  COMMUTE: 'commute',
  COMPENSATION: 'compensation',
  COMPETE: 'non-competes',
  COUNTRY: 'Country',
  DATES: 'please list 2-3 dates',
  DESCRIBE_EXP: 'describe your experience',
  DESIRED_PAY: 'Desired Pay',
  DISABILITY: 'Disability status',
  EDUCATION: 'What is the highest level of education',
  EST_TIME_ZONE: 'Are you currently located',
  GENDER: 'Gender',
  LANGUAGE: 'Do you speak Fluent English',
  NA: 'N/A',
  NAME: 'Your Name',
  OPTIONAL: 'optional', // we should skip all optional fields
  POSTAL_CODE: 'Postal Code',
  POSTAL_ZIP: 'Postal/ZIP',
  RACE1: 'Race/Ethnicity',
  RACE2: 'Race or Ethnicity',
  RIGHT_TO_WORK: 'Do you have the right to work in the US',
  SELECTOR1: 'ia-BasePage-component',
  SELECTOR2: 'ia-BasePage-component--withContinue',
  SPONSORSHIP: 'sponsorship', //no
  STATE_REGION: 'State or Region',
  STATE: 'State',
  TODAYS_DATE: "Today's Date",
  UNKNOWN: '', //if unknown select first option
  US_AUTH: 'Are you authorized to work in the United States', // search for yes
  US_CITIZEN: '',
  US_STATE_SELECTOR: '#state__United States__{"DATASOURCE":"CUSTOM_QUESTIONS"}',
  US_VALID: 'valid us citizenship',
  VACCINATED: 'vaccinated',
  VETERAN: 'Veteran status',
  WORK_AUTH: 'Work Authorization',
  YEARS_EXP: 'How many years', // can be multiple questions about experience ie. how many years of java
  ZIP_CODE: 'Zip Code',
  ZIP_POST_CODE: 'Zip/Postal Code',
};
export const ANSWERS = {
  ADDRESS: '34027 CA-41',
  AGREE: 'agree',
  BEEN_EMPLOYED: 'Have you ever been employed by', // we need to add company name here.
  CITY: 'Coarsegold',
  CLEARANCE: 'active security clearance',
  COMMUTE: 'no',
  COMPENSATION: 'compensation',
  COMPETE: 'non-competes',
  COUNTRY: 'United States',
  DATES: 'please list 2-3 dates',
  DESCRIBE_EXP: '', //add description based on language framework etc. or N/A
  DESIRED_PAY: '70000',
  DISABILITY: 'Disability status',
  EDUCATION: "Bachelor's",
  EST_TIME_ZONE: 'No',
  GENDER: 'Male',
  LANGUAGE: 'Do you speak Fluent English',
  NA: 'N/A',
  NAME: 'Mitchell Blake',
  OPTIONAL: 'optional', // we should skip all optional fields
  POSTAL_CODE: '93614',
  POSTAL_ZIP: '93614',
  RACE1: 'Black',
  RACE2: 'Black',
  RIGHT_TO_WORK: 'Yes',
  SPONSORSHIP: 'sponsorship',
  STATE_REGION: 'CA',
  STATE: 'CA',
  TODAYS_DATE: Date.now(), //get new date
  UNKNOWN: 'n/a',
  US_AUTH: 'Yes', // search for yes
  US_CITIZEN: '',
  US_STATE_SELECTOR: 'California',
  VETERAN_DISABILITY: "I don't",
  VETERAN: 'I am not',
  WORK_AUTH: 'United States Citizen', //can be citizen
  YEARS_EXP: '1',
  ZIP_CODE: '93614',
  ZIP_POST_CODE: '93614',
};

// alert that a field is required
export const REQUIRED = {
  ANSWER_THIS: 'Answer this question', //search for input and assign value as checked
};

export const getAllStorageSyncData = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (items) => {
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
export const setStorage = (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.sync.set({ key: val }, () => {
    console.log('Value is set to ' + val);
  });
};

/**
 * Retrieve the next job url from our stored links
 * @param {Records<string, string>} links a map of the links from localStorage
 * @param {string} oldHref the recently utilized link
 */
export const getNewHref = (oldHref, links) => {
  delete links[oldHref];

  const newHref = Object.keys(links).pop();

  if (newHref === undefined) {
    throw new Error('The url is undefined.');
  }

  return newHref;
};

const gotoNextPage = async () => {
  const nav = document.querySelector(INDEED_QUERY_SELECTOR.NAV_CONTAINER);
  nav?.scrollIntoView();

  const paginationNext = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM1);
  const paginationNext2 = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM2);

  if (paginationNext !== null) {
    await click(paginationNext);
  } else if (paginationNext2 !== null) {
    await click(paginationNext2);
  }
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

/**
 * Retrieves information about our current job application from webpage
 *
 * @param {string} appWindow : an href string of the current job application.
 * @returns {object} currentAppInfo : an object containing all information about the job application
 */
export const getAppInfo = (appWindow) => {
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

  currentAppInfo[HREF] = appWindow;
  return currentAppInfo;
};

export const handleApplyNowNotFound = (elem, currentUrl, links) => {
  if (!elem || elem.textContent !== APPLY.NOW) {
    delete links[currentUrl];

    return links;
  }

  return elem;
};

/**
 * Return the apply to job button which may have three values:  EX.(Apply now, Applied, or Apply on company site)
 * @param appWindow the current href value from our links object.
 * @throws Exception if this button is not an Apply Now Button.
 * @returns
 */

export const getApplyButton = (currentUrl, links) => {
  //we may need to extract this document value from the applyWindow parameter.
  const tryId = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON_WRAPPER)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON_ID);

  const tryButton = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(
      `${INDEED_QUERY_SELECTOR.APPLY_WIDGET} ${HTML_ELEMENT.BUTTON}`
    );

  return (
    handleApplyNowNotFound(tryId, currentUrl, links) ??
    handleApplyNowNotFound(tryButton, currentUrl, links)
  );
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

/**
 * Remove a link from our stored and local links map
 * @param {key:href, val:href} links
 */
export const deleteHref = (links, hrefToBeDeleted) => {
  const appInfo = getAppInfo(hrefToBeDeleted);
  delete links[appInfo.href];

  //window.localStorage.setItem(LINKS, JSON.stringify(links));
  console.log('FINISHED RUNNING APP SCRIPT', Object.keys(links).length);
  return links;
};

/**
 * crawls pages and collects job links
 */
export const collectLinks = async (appInfo) => {
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

  const getPageJobLinks = async () => {
    try {
      // TODO: this url should be updated later to be dynamic based on user preferences.
      let url = `https://www.indeed.com/jobs?q=software&l=Remote&fromage=${appInfo.user.jobPostingPreferredAge}`;
      await chrome.tabs.create({ url });
      console.log('LINKS LENGTH: before script run ', appInfo.user.jobLinks);

      const jobLinks = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);

      jobLinks?.forEach((link) => {
        const href = link.getAttribute(HREF);
        if (href) {
          appInfo.user.jobLinks[href] = href;
        }
      });

      console.log('LINKS LENGTH: after script run ', Object.keys(links));
      await gotoNextPage();
    } catch (e) {
      // TODO:
      // This needs to be replaced with an error logging system.
      // preferably stored in json/local db.
      console.log('Error Running script');
      console.log(e);
    }
  };

  while (appInfo.user.jobLinks.length < appInfo.user.jobLinksLimit) {
    await getPageJobLinks();
  }

  console.log('FINISHED COLLECTING JOBS!!!!!!');
};

/**
 * Collect all available job application links.
 */
export const handleJobLinksRetrieval = () => {
  chrome.action.onClicked.addListener(async (tab) => {
    // Asynchronously retrieve data from storage.sync, then cache it.
    let appInfo = {};
    try {
      appInfo = {
        ...(await getAllStorageSyncData('indeed').then((items) => items)),
      };
    } catch (e) {
      // Handle error that occurred during storage initialization.
      console.log('could not retrieve application information');
      console.log(e);
    }

    console.log('success info retrieval');

    let url = 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14';
    await chrome.tabs.create({ url });
    let testFunc = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: test,
    });
    console.log(testFunc[0].result);
  });
};
