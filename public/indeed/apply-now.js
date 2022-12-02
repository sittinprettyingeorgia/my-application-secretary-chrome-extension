(async () => {
  if (document.readyState === 'complete') {
    const handleApplyNow = async () => {
      const REGEX = {
        CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
        CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
        CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
        JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=7',
      };

      // application button text variations
      const APPLY = {
        NOW: 'Apply now',
        APPLIED: 'Applied',
        COMPANY_SITE: 'Apply on company site',
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

        for (const [camelCaseValues, lowerCaseValues] of Object.entries(
          APP_INFO
        )) {
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

      const gotoJobApplicationForm = () => {
        if (paginationNext !== null) {
          sendScanCompleteMessage(port, user, 'completed page scan', true);
          paginationNext.click();
        } else if (paginationNext2 !== null) {
          sendScanCompleteMessage(port, user, 'handle job posting', true);
          paginationNext2.click();
        }
      };

      const validateApplyNow = async (user, port, messageId) => {
        try {
          let { jobLinks = [] } = user ?? {};
          const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };

          let currentUrl = window.location.href;

          currentUrl = linksKeys.pop();
          window.location.replace(currentUrl);

          console.log('RUNNING APP SCRIPT', Object.keys(links).length);
          let applyNowButton;
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

      const handleJobPosting = async () => {
        // Asynchronously retrieve data from storage.sync, then cache it.
        let appInfo = {};

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
          status: 'connection received, handling application',
        });

        await handleJobPosting(port, msg.jobPostingUrl, msg.messageId);
      };

      let port = chrome.runtime.connect({ name: 'apply-now' });
      port.postMessage({ status: 'connecting apply-now messenger' });

      port.onMessage.addListener(async (msg) => {
        switch (msg.response) {
          case 'connected':
            await handleConnectedAction(port, msg);
            break;
          case 'waiting for message':
            console.log('background did not receive message');
          default:
            port.postMessage({ status: 'waiting for message...' });
        }
      });
    };

    handleApplyNow();
  }
})();
