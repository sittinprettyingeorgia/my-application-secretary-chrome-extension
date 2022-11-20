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

/**
 * Sets current application information to local storage to use during form
 */
export const setStorage = (key, val) => {
  if (!val || !key) {
    return;
  }

  chrome.storage.sync.set({ [key]: val }, () => {
    console.log('Value is set to ' + JSON.stringify(val));
  });

  console.log('Successfully stored information');
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
function setupDetails(action, args, id) {
  // Wrap the async function in an await and a runtime.sendMessage with the result
  // This should always call runtime.sendMessage, even if an error is thrown
  const wrapAsyncSendMessage = (action) =>
    `(async function () {
    const result = { asyncFuncID: '${id}' };
    try {
        result.content = await (${action})(${args});
    }
    catch(x) {
        // Make an explicit copy of the Error properties
        result.error = { 
            message: x.message, 
            arguments: x.arguments, 
            type: x.type, 
            name: x.name, 
            stack: x.stack 
        };
    }
    finally {
        // Always call sendMessage, as without it this might loop forever
        chrome.runtime.sendMessage(result);
    }
})()`;

  // Apply this wrapper to the code passed
  let execArgs = {};
  if (typeof action === 'function' || typeof action === 'string')
    // Passed a function or string, wrap it directly
    execArgs.code = wrapAsyncSendMessage(action);
  else if (action.file)
    throw new Error(
      `Cannot execute ${action.file}. File based execute scripts are not supported.`
    );
  else
    throw new Error(
      `Cannot execute ${JSON.stringify(
        action
      )}, it must be a function, string, or have a code property.`
    );

  return execArgs;
}

function promisifyRuntimeMessage(id) {
  // We don't have a reject because the finally in the script wrapper should ensure this always gets called.
  return new Promise((resolve) => {
    const listener = (request) => {
      // Check that the message sent is intended for this listener
      if (request && request.asyncFuncID === id) {
        // Remove this listener
        chrome.runtime.onMessage.removeListener(listener);
        resolve(request);
      }

      // Return false as we don't want to keep this channel open https://developer.chrome.com/extensions/runtime#event-onMessage
      return false;
    };

    chrome.runtime.onMessage.addListener(listener);
  });
}

chrome.tabs.executeAsyncFunction = async function(tabId, args, action) {
  // Generate a random 4-char key to avoid clashes if called multiple times
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

  const message = promisifyRuntimeMessage(id);

  // This will return a serialised promise, which will be broken
  chrome.scripting.executeScript({
    target: { tabId },
    func: setupDetails,
    args: [action, args, id],
  });

  // Wait until we have the result message
  const { content, error } = await message;

  if (error)
    throw new Error(`Error thrown in execution script: ${error.message}.
Stack: ${error.stack}`);

  return content;
};

/**
 * crawls pages and collects job links
 */
export const collectLinks = async (user) => {
  let { jobLinks = {}, jobPostingPreferredAge = 14, jobLinksLimit = 600 } =
    user ?? {};

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
      console.log(
        'LINKS LENGTH: before script run ',
        Object.keys(jobLinks)?.length
      );

      const newJobLinks = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);

      newJobLinks?.forEach((link) => {
        const href = link.getAttribute(HREF);
        if (href) {
          jobLinks[href] = href;
        }
      });

      console.log(
        'LINKS LENGTH: after script run ',
        Object.keys(jobLinks)?.length
      );
      await gotoNextPage();
    } catch (e) {
      // TODO:
      // This needs to be replaced with an error logging system.
      // preferably stored in json/local db.
      console.log('Error Running script');
      console.log(e);
      throw new Error('Script failed');
    }
  };

  while (!jobLinks || jobLinks.length < jobLinksLimit) {
    await getPageJobLinks();
  }

  console.log('FINISHED COLLECTING JOBS!!!!!!');
  console.log('Job Links Collected: ' + jobLinks?.length);
  return jobLinks;
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
      console.log(JSON.stringify(appInfo));
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

    /*const jobLinks = {
      ...(
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: collectLinks,
          args: [appInfo?.indeed?.user],
        })
      )[0].result,
    };*/
    const jobLinks = await chrome.tabs.executeAsyncFunction(
      tab.id,
      appInfo?.indeed?.user,
      collectLinks
    );

    console.log(jobLinks);
  });
};
