// Alternative to load event
(async () => {
  if (document.readyState === 'complete') {
    const getLinks = async () => {
      const DEFAULTS = {
        limit: 600,
      };

      //APPLY NOW CONSTANTS | apply-now.js
      const REGEX = {
        CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
        CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
        CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
        JOB_WINDOW:
          'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14',
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

      const constructMap = (arr) => {
        let map = {};

        for (const item of arr) {
          map[item] = item;
        }

        return map;
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
       * @returns {HTMLElement}
       */
      const retrieveElem = (selector) => {
        return document.querySelector(selector);
      };

      // sends data to our local storage so background has access
      const sendScanCompleteMessage = async (
        port,
        user,
        status,
        inProgress
      ) => {
        user.jobLinkCollectionInProgress = inProgress;
        port.postMessage({
          status,
          data: user,
        });

        await setStorageLocalData('indeed', {
          applicationName: 'indeed',
          user,
        });
      };

      /**
       * crawls pages and collects job links
       */
      const collectLinks = async (user, port, messageId) => {
        let {
          jobLinks = [],
          jobPostingPreferredAge = 14,
          jobLinksLimit = 600,
        } = user ?? {};

        const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };
        const newJobLinks = constructMap(jobLinks);

        const gotoNextPage = (newJobLinks) => {
          const nav = document.querySelector(
            INDEED_QUERY_SELECTOR.NAV_CONTAINER
          );
          nav?.scrollIntoView();

          const paginationNext = retrieveElem(
            INDEED_QUERY_SELECTOR.PAGINATION_ELEM1
          );
          const paginationNext2 = retrieveElem(
            INDEED_QUERY_SELECTOR.PAGINATION_ELEM2
          );

          user.jobLinks = [...user.jobLinks, ...newJobLinks];

          if (paginationNext !== null) {
            sendScanCompleteMessage(port, user, 'completed page scan', true);
            paginationNext.click();
          } else if (paginationNext2 !== null) {
            sendScanCompleteMessage(port, user, 'completed page scan', true);
            paginationNext2.click();
          }
        };

        const getPageJobLinks = async (user) => {
          try {
            const links = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);
            for (const link of links) {
              const href = link.getAttribute('href');

              if (href) {
                newJobLinks[href] = href;
              }
            }

            gotoNextPage(Object.keys(newJobLinks));
          } catch (e) {
            console.log('script failed', e);
            throw new Error('script failed');
          }
        };

        try {
          if (
            !newJobLinks ||
            Object.keys(newJobLinks)?.length < jobLinksLimit
          ) {
            await getPageJobLinks(port);
          } else {
            await sendScanCompleteMessage(
              port,
              user,
              'completed job-links scan',
              false
            );
          }

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
            //TODO: wee need to wait until our onboarding site is loaded
            throw new Error('Please create a user');
          }
        } catch (e) {
          // Handle error that occurred during storage initialization.
          console.log('could not retrieve application information');
          console.log(e);
        }

        const user = appInfo?.indeed?.user;
        await collectLinks(user, port, messageId);
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
    };

    getLinks();
  }
})();
