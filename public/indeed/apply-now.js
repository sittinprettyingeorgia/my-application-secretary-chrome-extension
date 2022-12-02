(async () => {
  //APPLY NOW CONSTANTS | apply-now.js
  const REGEX = {
    CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
    CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
    CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
    JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=7',
  };
  const INDEED_BASE = 'https://www.indeed.com';

  // application button text variations
  const APPLY = {
    NOW: 'Apply now',
    APPLIED: 'Applied',
    COMPANY_SITE: 'Apply on company site',
  };

  /**
   * Remove a link from our stored and local links map
   * @param {key:href, val:href} links
   */
  const deleteHref = (links, hrefToBeDeleted) => {
    const appInfo = getAppInfo(hrefToBeDeleted);
    delete links[appInfo.href];

    //window.localStorage.setItem(LINKS, JSON.stringify(links));
    console.log('FINISHED RUNNING APP SCRIPT', Object.keys(links).length);
    return links;
  };

  /**
   * Return the apply to job button which may have three values:  EX.(Apply now, Applied, or Apply on company site)
   * @param appWindow the current href value from our links object.
   * @throws Exception if this button is not an Apply Now Button.
   * @returns
   */
  const getApplyButton = (currentUrl, links) => {
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

  /**
   * Retrieve the next job url from our stored links
   * @param {Records<string, string>} links a map of the links from localStorage
   * @param {string} oldHref the recently utilized link
   */
  const getNewHref = (oldHref, links) => {
    delete links[oldHref];

    const newHref = Object.keys(links).pop();

    if (newHref === undefined) {
      throw new Error('The url is undefined.');
    }

    return newHref;
  };

  /**
   * Sets current application information to local storage to use during form
   */
  const setStorage = async (key, val) => {
    if (!val || !key) {
      return;
    }

    chrome.storage.sync.set({ [key]: val }, () => {
      console.log('Value is set to ' + JSON.stringify(val));
    });
  };

  /**
   * Returns some stored information for a user
   *
   * @param {string} key the key for our stored object
   * @returns
   */
  const getAllStorageSyncData = (key) => {
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
   * Retrieves information about our current job application from webpage
   *
   * @param {string} appWindow : an href string of the current job application.
   * @returns {object} currentAppInfo : an object containing all information about the job application
   */
  const getAppInfo = (appWindow) => {
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

  const handleApplyNowNotFound = (elem, currentUrl, links) => {
    if (!elem || elem.textContent !== APPLY.NOW) {
      delete links[currentUrl];

      return links;
    }

    return elem;
  };

  const handleApplication = async () => {
    let links = {};

    getStoredLinks(links);

    const handleApp = async () => {
      try {
        let currentUrl = window.location.href;

        if (currentUrl.search(REGEX.CONTAINS_APPS) < 0) {
          const linksKeys = Object.keys(links);

          if (!linksKeys || linksKeys.length < 1) {
            throw new Error('No links are available');
          }

          currentUrl = linksKeys.pop();
          window.location.replace(currentUrl);
        }

        console.log('RUNNING APP SCRIPT', Object.keys(links).length);
        let applyNowButton;

        setTimeout(() => {
          //we want to wait a second to ensure page scripts have loaded.
          try {
            applyNowButton = getApplyButton(currentUrl, links);
          } catch (e) {
            console.log(e);
            currentUrl = getNewHref(currentUrl, links);
          }

          if (
            applyNowButton !== null &&
            applyNowButton?.textContent === APPLY.NOW
          ) {
            currentUrl && setAppInfo(currentUrl);
            applyNowButton.click();
          }
        }, 1000);
      } catch (e) {
        console.log('Error Running script');
        console.log(e);
      }
    };

    handleApp();
  };
})();
