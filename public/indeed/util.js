/**
 * Store links in local storage
 * @param newLinks
 */
export const setLinks = (newLinks) => {
  if (!newLinks) {
    return;
  }

  const jobLinks = Object.keys(newLinks);
  chrome.storage.local.set({ LINKS: jobLinks }, function() {
    console.log('jobLinks are set to ' + jobLinks);
  });

  //this will be replaced with call to Go backend
  //window.localStorage.setItem(LINKS, JSON.stringify({ jobLinks }));
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

/**
 * Retrieves our links object from local storage.
 * @returns {Record<string, string>}
 */
export const getStoredLinks = () => {
  const links = {};

  try {
    chrome.storage.sync.get([LINKS], (result) => {
      links = result;
      console.log('jobLinks are ' + result);
    });
  } catch (e) {
    console.log('retrieving links failed');
    console.log(e);
  }

  return links;
};

export const click = async (elem) => {
  elem.click();
};
/**
 * Sets current application information to local storage to use during form
 */
export const setAppInfo = (url) => {
  const appInfo = getAppInfo(url);
  chrome.storage.sync.set({ key: value }, function() {
    console.log('Value is set to ' + value);
  });

  if (!appInfo) {
    return;
  }

  //window.localStorage.setItem(KEYS.APP_INFO, JSON.stringify(appInfo));
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

    setLinks(links);
    return undefined;
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

  setLinks(links);
  //window.localStorage.setItem(LINKS, JSON.stringify(links));
  console.log('FINISHED RUNNING APP SCRIPT', Object.keys(links).length);
};
