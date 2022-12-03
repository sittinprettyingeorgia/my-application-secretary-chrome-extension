(async () => {
  if (document.readyState === 'complete') {
    const handleApplyNow = async () => {
      // application button text variations
      const APPLY = {
        NOW: 'Apply now',
        APPLIED: 'Applied',
        COMPANY_SITE: 'Apply on company site',
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
      const APP_INFO = {
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
      const PREFIX = 'data-indeed-apply-';

      /**
       * Return the apply to job button which may have three values:  EX.(Apply now, Applied, or Apply on company site)
       * @param currentUrl the current href value from our links object.
       * @throws Exception if this button is not an Apply Now Button.
       * @returns
       */
      const getApplyButton = (currentUrl) => {
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
          handleApplyNowNotFound(tryId, currentUrl) ??
          handleApplyNowNotFound(tryButton, currentUrl)
        );
      };

      /**
       * Retrieves information about our current job application from webpage
       *
       * @param {string} currentUrl : an href string of the current job application.
       * @returns {object} currentAppInfo : an object containing all information about the job application
       */
      const getAppInfo = (currentUrl) => {
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

        currentAppInfo[HREF] = currentUrl;
        console.log('currentAppInfo', JSON.stringify(currentAppInfo));
        return currentAppInfo;
      };

      const handleApplyNowNotFound = (elem) => {
        if (!elem || elem.textContent !== APPLY.NOW) {
          const status = 'job posting is not apply-now';
          const url = window.location.href;

          port.postMessage({ status, url });
          throw new Error(status);
        }

        return elem;
      };

      const validateApplyNow = async (user, port, messageId) => {
        try {
          let { jobLinks = [] } = user ?? {};
          const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };

          let currentUrl = window.location.href;
          let applyNowButton;
          try {
            applyNowButton = getApplyButton(currentUrl, links);
          } catch (e) {
            //this is not an apply now job posting
            const status = 'job posting is not apply-now';
            const url = window.location.href;
            port.postMessage({ status, url });
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

      const handleJobPosting = async (port, messageId) => {
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
          status: 'connection received, handling job posting',
        });

        await handleJobPosting(port, msg.messageId);
      };

      let port = chrome.runtime.connect({ name: 'handle-job-posting' });
      port.postMessage({ status: 'connecting handle-job-posting messenger' });

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
