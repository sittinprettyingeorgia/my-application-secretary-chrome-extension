import axios from 'axios';
import {
  APPLY,
  APP_INFO,
  PREFIX,
  KEYS,
  HTML_ELEMENT,
  INDEED_QUERY_SELECTOR,
  LINKS,
  HREF,
  MOUSE,
} from './constants';

/**
 * Store links in local storage
 * @param newLinks
 */
export const setLinks = async (newLinks?: Record<string, string>) => {
  //const jobLinks = Object.keys(newLinks);
  //this will be replaced with call to Go backend
  //window.localStorage.setItem(LINKS, JSON.stringify({ jobLinks: jobLinks }));
  return axios({
    method: 'POST',
    url: 'http://localhost:8080/jobLinks',
    data: JSON.stringify({
      testFrontUrl: 'testFrontUrl',
      testFront: 'testFront',
    }),
  }).then((response) => console.log(response.data));
};

/**
 * Retrieve the next job url from our stored links
 * @param {Records<string, string>} links a map of the links from localStorage
 * @param {string} oldHref the recently utilized link
 */
export const getNewHref = (
  oldHref: string,
  links: Record<string, string>
): string => {
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
export const retrieveElems = (
  selector: string
): NodeListOf<HTMLElement> | null => {
  return document.querySelectorAll(selector);
  //return document.querySelector(selector);
};
/**
 * Retrieve an element using a query selector
 *
 * @param {string} selector
 * @returns {HTMLElement[]}
 */
export const retrieveElem = (selector: string): HTMLElement | null => {
  return document.querySelector(selector);
};

/**
 * Retrieves our links object from local storage.
 * @param {Record<string, string>}links the link object to be added too
 * @returns {Record<string, string>}
 */
export const getStoredLinks = async (
  links: Record<string, string>
): Promise<Record<string, string> | undefined> => {
  try {
    //this should be replaced with call to Go backend
    const newLinksArr = localStorage.getItem(LINKS);

    const temp: string[] = newLinksArr && JSON.parse(newLinksArr);

    var newLinks: Record<string, string> = {};

    if (temp) {
      for (const s of temp) {
        newLinks[s] = s;
      }
    }

    return newLinks;
  } catch (e) {
    return links;
  }
};

export const click = async (elem: HTMLElement): Promise<void> => {
  elem.click();
};
/**
 * Sets current application information to local storage to use during form
 */
export const setAppInfo = (url: string): void => {
  const appInfo = getAppInfo(url);

  if (!appInfo) {
    return;
  }

  window.localStorage.setItem(KEYS.APP_INFO, JSON.stringify(appInfo));
};

/**
 * Retrieves information about our current job application from webpage
 *
 * @param {string} appWindow : an href string of the current job application.
 * @returns {object} currentAppInfo : an object containing all information about the job application
 */
export const getAppInfo = (appWindow: string): Record<string, string> => {
  const applyWidget = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_WIDGET);

  const currentAppInfo: Record<string, string> = {}; //All information of our application should be stored here.

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

export const handleApplyNowNotFound = (
  elem: HTMLElement | null | undefined,
  currentUrl: string,
  links: Record<string, string>
): HTMLElement | undefined => {
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
export const getApplyButton = (
  currentUrl: string,
  links: Record<string, string>
): HTMLElement | undefined => {
  //we may need to extract this document value from the applyWindow parameter.
  const tryId: HTMLElement | null | undefined = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON_WRAPPER)
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON_ID);

  const tryButton: HTMLElement | null | undefined = document
    ?.querySelector(INDEED_QUERY_SELECTOR.APPLY_BUTTON)
    ?.querySelector(
      `${INDEED_QUERY_SELECTOR.APPLY_WIDGET} ${HTML_ELEMENT.BUTTON}`
    );

  return (
    handleApplyNowNotFound(tryId, currentUrl, links) ??
    handleApplyNowNotFound(tryButton, currentUrl, links)
  );
};

export const triggerMouseEvent = (node: EventTarget, eventType: string) => {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

export const simulateApplyNow = (applyNowButton: HTMLElement): void => {
  for (const event of Object.values(MOUSE)) {
    triggerMouseEvent(applyNowButton, event);
  }
};

/**
 * Remove a link from our stored and local links map
 * @param {key:href, val:href} links
 */
export const deleteHref = (
  links: Record<string, string>,
  hrefToBeDeleted: string
): void => {
  const appInfo = getAppInfo(hrefToBeDeleted);
  delete links[appInfo.href];

  setLinks(links);
  window.localStorage.setItem(LINKS, JSON.stringify(links));
  console.log('FINISHED RUNNING APP SCRIPT', Object.keys(links).length);
};
