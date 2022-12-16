(async () => {
  if (document.readyState === 'complete') {
    const handleForm = () => {
      let appInfo = {};

      // local storage
      const KEYS = {
        APP_INFO: 'appInfo',
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
        INPUT: 'input',
      };
      // alert that a field is required
      const REQUIRED = {
        ANSWER_THIS: 'Answer this question', //search for input and assign value as checked
      };
      // query selector prefix combinations
      const PREFIX = 'data-indeed-apply-';
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
      //APPLY NOW CONSTANTS | apply-now.js
      const REGEX = {
        CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
        CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
        CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
        JOB_WINDOW:
          'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14',
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

      // Event types
      const MOUSE = {
        OVER: 'mouseover',
        DOWN: 'mousedown',
        UP: 'mouseup',
        CLICK: 'click',
      };

      const HTML_ELEMENT = {
        BUTTON: 'button',
      };

      const triggerMouseEvent = (node, eventType) => {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
      };

      const simulateApplyNow = (applyNowButton) => {
        triggerMouseEvent(applyNowButton, MOUSE.OVER);
        triggerMouseEvent(applyNowButton, MOUSE.DOWN);
        triggerMouseEvent(applyNowButton, MOUSE.UP);
        triggerMouseEvent(applyNowButton, MOUSE.CLICK);
      };

      //APP FORM CONSTANTS | handle-app-form.js
      const SUBMIT = {
        APPLICATION: 'Submit you application',
        BUTTON: '.ia-continueButton',
        CONTINUE: 'Continue',
        CONTINUE_SELECTOR: 'ia-continueButton',
        RETURN_TO_SEARCH_SELECTOR: '#returnToSearchButton',
        RETURN_TO_SEARCH: 'Return to job search',
        REVIEW_APPLICATION: 'Review you application',
      };
      const QUESTIONS = {
        ADDRESS: 'Address',
        AGE: 'at least 18 years of age',
        AGREE: 'agree',
        AVAILABILITY_MEET: 'When are you available',
        BEEN_EMPLOYED: 'Have you ever applied for employment at',
        BEEN_EMPLOYED: 'Have you ever been employed by', // we need to add company name here.
        CITIZEN: 'What is your citizenship',
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
        DOD_EXP: 'Do you have DoD experience',
        EDUCATION: 'Highest Education Level',
        EDUCATION: 'What is the highest level of education',
        EST_TIME_ZONE: 'Are you currently located',
        EXP: 'Years of experience',
        GENDER: 'Gender',
        LANGUAGE: 'Do you speak Fluent English',
        MILITARY_STATUS: 'Present military status',
        MILITARY: 'been a member of U.S. Armed Services?',
        NA: 'N/A',
        NAME: 'Your Name',
        OPTIONAL: 'optional', // we should skip all optional fields
        POSTAL_CODE: 'Postal Code',
        POSTAL_ZIP: 'Postal/ZIP',
        QUESTION_ITEM: 'ia-Questions-item',
        RACE1: 'Race/Ethnicity',
        RACE2: 'Race or Ethnicity',
        RELATIVES: 'Do you have relatives who work',
        RELOCATION: 'Are you willing to relocate',
        RIGHT_TO_WORK: 'Do you have the right to work in the US',
        SALARY_RQ: 'Salary requirements',
        SECURITY_DENY: 'Have you ever been denied a Security Clearance',
        SELECTOR1: '.ia-BasePage-component',
        SELECTOR2: '.ia-BasePage-component--withContinue',
        SEX_GENDER: 'Sex/Gender',
        SMS: 'SMS text',
        SPONSORSHIP: 'sponsorship', //no
        STATE_REGION: 'State or Region',
        STATE: 'State',
        TERMS: 'By applying to this position, I agree to',
        TODAYS_DATE: "Today's Date",
        UNKNOWN: '', //if unknown select first option
        US_AUTH: 'Are you authorized to work in the United States', // search for yes
        US_CITIZEN: '',
        US_STATE_SELECTOR:
          '#state__United States__{"DATASOURCE":"CUSTOM_QUESTIONS"}',
        US_VALID: 'valid us citizenship',
        VACCINATED: 'vaccinated',
        VETERAN: 'Veteran status',
        WORK_AUTH: 'Work Authorization',
        YEARS_EXP: 'How many years', // can be multiple questions about experience ie. how many years of java
        ZIP_CODE: 'Zip Code',
        ZIP_POST_CODE: 'Zip/Postal Code',
      };
      const ANSWERS = {
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

      const getQuestions = (resource) => {
        const questions = [];
        const questionElems = resource.getElementsByClassName(
          QUESTIONS.QUESTION_ITEM
        );

        for (const questionElem of questionElems) {
          const elems = questionElem?.getElementsByTagName('input');
          const legend = questionElem?.getElementsByTagName('legend')[0];
          const text = legend && legend?.textContent;
          let question = { text };
          port.postMessage({
            status: 'debug',
            debug: 'legend text =' + text,
          });

          for (let i = 0; i < elems?.length; i++) {
            const label = document.querySelector(
              "label[for='" + elems[i].id + "']"
            );

            question[`label${i}`] = label;
          }

          questions.push(question);
        }

        return questions;
      };

      const handleQuestionsWithoutCall = (jobPreferences) => {
        const submitButton = retrieveElem(SUBMIT.BUTTON);
        const questions1 = retrieveElem(QUESTIONS.SELECTOR1);
        const questions2 = retrieveElem(QUESTIONS.SELECTOR2);

        //elem.textContent
        if (questions1 !== null) {
          const questions = getQuestions(questions1);
          for (const question of questions) {
          }
        }
      };

      const handleQuestions = (jobPreferences, questions) => {
        //each question is a json object
        // EX. {id: '1208817', options: Array(2),
        // question: '<br/>Do you have DoD experience?', required: 'true', type: 'select'}
        // we should send the questions url from appInfo to our backend.
        for (const question of questions) {
        }
      };

      const handleFormInteraction = async (user, port, messageId) => {
        let {
          jobLinks = [],
          jobPreferences = {},
          currentAppInfo = {},
        } = user ?? {};

        const { questions: questionsLink } = currentAppInfo;
        const questionResponse = await fetch(`${questionsLink}`);
        const questions = response.json();
        const requiredQuestions = questions.filter((q) => q?.required);
        const answerResponse = await fetch(
          `http://localhost:3540/users/${userId}/answers`
        );
        const answers = answerResponse.json();
        const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };

        port.postMessage({
          status: 'debug',
          debug: { requiredQuestions, answers },
        });
        try {
          handleQuestions(jobPreferences, requiredQuestions);
        } catch (x) {
          if (x.message === 'error running form script') {
            port.postMessage({ status: 'error running form script' });
          }
          // Make an explicit copy of the Error properties
          result.error = {
            message: x.message,
            arguments: x.arguments,
            type: x.type,
            name: x.name,
            stack: x.stack,
          };

          port.postMessage({ status: 'debug', debug: result });
        }
      };

      const setup = async (port, messageId, appInfo) => {
        const user = appInfo?.indeed?.user;
        port.postMessage({ status: 'debug', debug: appInfo }); //TODO: we can retrieve appInfo
        // TODO: appInfo should be verified against preferences before visiting the form page.
        //TODO: now we need to upgrade our user object for all of the form information.
        await handleFormInteraction(user, port, messageId);

        /*const handleSubmit = () => {
        if (
          submitButton !== null &&
          submitButton.textContent === SUBMIT.APPLICATION
        ) {
          await click(submitButton);
          alert('we have found a submit button');
        }else if ()*/
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
          status: 'connection received, handling job form',
        });

        await setup(port, msg.messageId, msg.appInfo);
      };

      let port = chrome.runtime.connect({ name: 'handle-job-form' });
      port.postMessage({ status: 'connecting handle-job-form messenger' });
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

    handleForm();
  }
})();
