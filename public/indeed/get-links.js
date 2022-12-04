// Alternative to load event
(async () => {
  if (document.readyState === 'complete') {
    const getLinks = async () => {
      const DEFAULTS = {
        limit: 600,
      };
      const STORAGE_KEY = 'indeed';
      const INDEED_BASE = 'https://www.indeed.com';
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
      const COMPLETED = 'completed job-links scan';
      const COMPLETED_PAGE = 'completed page scan';

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

        chrome.storage.local.set({ [key]: val }, () => {});
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
        jobLinkCollectionInProgress
      ) => {
        user.jobLinkCollectionInProgress = jobLinkCollectionInProgress;
        user.jobPostingInProgress = true;
        const uniqueJobLinks = [...new Set(user.jobLinks)];
        user.jobLinks = [...uniqueJobLinks];
        user.jobLinks.sort();

        await setStorageLocalData(STORAGE_KEY, {
          applicationName: STORAGE_KEY,
          user: { ...user },
        });

        if (status === COMPLETED) {
          const link = user.jobLinks.pop();
          window.location.replace(INDEED_BASE + link);
        }
      };

      /**
       * crawls pages and collects job links
       */
      const collectLinks = async (user, port, messageId) => {
        let { jobLinks = [], jobPreferences = {} } = user ?? {};
        const result = {
          asyncFuncID: `${messageId}`,
          jobLinks,
          error: {},
        };
        const { jobLinksLimit } = jobPreferences;
        const newJobLinks = new Set(jobLinks);

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

          user.jobLinks = [...new Set([...user.jobLinks, ...newJobLinks])];

          if (paginationNext !== null) {
            sendScanCompleteMessage(port, user, COMPLETED_PAGE, true);
            paginationNext.click();
          } else if (paginationNext2 !== null) {
            sendScanCompleteMessage(port, user, COMPLETED_PAGE, true);
            paginationNext2.click();
          }
        };

        const getPageJobLinks = async () => {
          try {
            const links = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);
            for (const link of links) {
              const href = link.getAttribute('href');

              if (href) {
                newJobLinks.add(href);
              }
            }

            gotoNextPage(newJobLinks);
          } catch (e) {
            console.log('script failed', e);
            throw new Error('script failed');
          }
        };

        try {
          if (!newJobLinks || newJobLinks?.size < jobLinksLimit) {
            await getPageJobLinks(port);
          } else {
            await sendScanCompleteMessage(port, user, COMPLETED, false);
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

          const status = 'There was an error collecting job links';
          const url = window.location.href;
          result.url = url;
          port.postMessage({ status, data: result });
        }
      };

      /**
       * Collect all available job application links.
       */
      const setup = async (port, messageId) => {
        // Asynchronously retrieve data from storage.sync, then cache it.
        let appInfo = {};

        try {
          appInfo = {
            ...(await getAllStorageLocalData('indeed').then((items) => items)),
          };

          if (!appInfo?.indeed?.user) {
            //TODO: window.location.replace('onboarding.html');
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

        await setup(port, msg.messageId);
      };
      console.log('inside get-links');

      let port = chrome.runtime.connect({ name: 'get-links' });
      port.postMessage({ status: 'connecting job-links messenger' });
      port.onMessage.addListener(async (msg) => {
        switch (msg.response) {
          case 'connected':
            await handleConnectedAction(port, msg);
            break;
          case 'waiting for actionable message':
            console.log('background did not receive message');
            break;
          default:
            port.postMessage({ status: 'waiting for actionable message...' });
        }
      });
    };

    getLinks();
  }
})();
