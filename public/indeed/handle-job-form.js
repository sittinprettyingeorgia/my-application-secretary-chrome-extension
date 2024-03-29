(async () => {
  if (document.readyState === "complete") {
    const handleForm = () => {
      let appInfo = {};

      // local storage
      const KEYS = {
        APP_INFO: "appInfo",
      };

      const INDEED_QUERY_SELECTOR = {
        APPLY_BUTTON_ID: "#indeedApplyButton",
        APPLY_BUTTON_WRAPPER: ".jobsearch-IndeedApplyButton-buttonWrapper",
        APPLY_BUTTON: ".ia-IndeedApplyButton",
        APPLY_WIDGET: ".indeed-apply-widget",
        CONTINUE_BUTTON: ".ia-continueButton",
        INPUT: "input",
        JOB_LINKS: ".jobTitle a",
        NAV_CONTAINER: "nav[role=navigation",
        PAGINATION_ELEM1: "a[data-testid=pagination-page-next]",
        PAGINATION_ELEM2: "a[aria-label=Next]",
        RESUME_CONTINUE: ".ia-Resume-continue",
      };
      // alert that a field is required
      const REQUIRED = {
        ANSWER_THIS: "Answer this question", //search for input and assign value as checked
      };
      // query selector prefix combinations
      const PREFIX = "data-indeed-apply-";
      const APP_INFO = {
        apiToken: "apitoken",
        advNum: "advnum",
        continueUrl: "continueurl",
        coverletter: "coverletter",
        jobUrl: "joburl",
        postUrl: "posturl",
        questions: "questions",
        jK: "jk",
        jobCompany: "jobcompanyname",
        jobId: "jobid",
        jobLocation: "joblocation",
        jobTitle: "jobtitle",
        noButtonUI: "nobuttonui",
        onAppliedStatus: "onappliedstatus",
        onReady: "onready",
        phone: "phone",
        pingbackUrl: "pingbackurl",
        recentSearchQuery: "recentsearchquery",
        resume: "resume",
      };
      //APPLY NOW CONSTANTS | apply-now.js
      const REGEX = {
        CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
        CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
        CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
        JOB_WINDOW:
          "https://www.indeed.com/jobs?q=software&l=Remote&fromage=14",
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
        OVER: "mouseover",
        DOWN: "mousedown",
        UP: "mouseup",
        CLICK: "click",
      };

      const HTML_ELEMENT = {
        BUTTON: "button",
      };

      const triggerMouseEvent = (node, eventType) => {
        var clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
      };

      const simulateApplyNow = (applyNowButton) => {
        triggerMouseEvent(applyNowButton, MOUSE.OVER);
        triggerMouseEvent(applyNowButton, MOUSE.DOWN);
        triggerMouseEvent(applyNowButton, MOUSE.UP);
        triggerMouseEvent(applyNowButton, MOUSE.CLICK);
      };

      const gotoNextPage = () => {
        const continueBttn = document.querySelector(
          INDEED_QUERY_SELECTOR.CONTINUE_BUTTON
        );
        const resumeBttn = document.querySelector(
          INDEED_QUERY_SELECTOR.RESUME_CONTINUE
        );

        if (continueBttn || resumeBttn) {
          continueBttn?.scrollIntoView() && resumeBttn?.scrollIntoView();
          continueBttn?.click() && resumeBttn.click();
        }

        return false;
      };

      const getElementTextContent = (element) => {
        let text = "";

        // Check if the element has child nodes
        if (element.childNodes.length > 0) {
          // Loop over each child node
          for (let i = 0; i < element.childNodes.length; i++) {
            const childNode = element.childNodes[i];
            // Check if the child node is a text node
            if (childNode.nodeType === Node.TEXT_NODE) {
              // Add the text content of the child node to the result
              text += childNode.textContent.trim();
            }
            // If the child node is an element node, recursively call the function to get its text content
            else if (childNode.nodeType === Node.ELEMENT_NODE) {
              text += getElementTextContent(childNode);
            }
          }
        }
        // If the element has no child nodes, return its text content
        else {
          text = element.textContent.trim();
        }

        return text;
      };

      //these form constants should be retrieved via fetch
      //APP FORM CONSTANTS | handle-app-form.js
      const SUBMIT = {
        APPLICATION: "Submit you application",
        BUTTON: ".ia-continueButton",
        CONTINUE: "Continue",
        CONTINUE_SELECTOR: "ia-continueButton",
        RETURN_TO_SEARCH_SELECTOR: "#returnToSearchButton",
        RETURN_TO_SEARCH: "Return to job search",
        REVIEW_APPLICATION: "Review you application",
      };
      const ANSWERS = {
        ADDRESS: "34027 CA-41",
        AGREE: "agree",
        BEEN_EMPLOYED: "Have you ever been employed by", // we need to add company name here.
        CITY: "Coarsegold",
        CLEARANCE: "active security clearance",
        COMMUTE: "no",
        COMPENSATION: "compensation",
        COMPETE: "non-competes",
        COUNTRY: "United States",
        DATES: "please list 2-3 dates",
        DESCRIBE_EXP: "", //add description based on language framework etc. or N/A
        DESIRED_PAY: "70000",
        DISABILITY: "Disability status",
        EDUCATION: "Bachelor's",
        EST_TIME_ZONE: "No",
        GENDER: "Male",
        LANGUAGE: "Do you speak Fluent English",
        NA: "N/A",
        NAME: "Mitchell Blake",
        OPTIONAL: "optional", // we should skip all optional fields
        POSTAL_CODE: "93614",
        POSTAL_ZIP: "93614",
        RACE1: "Black",
        RACE2: "Black",
        RIGHT_TO_WORK: "Yes",
        SPONSORSHIP: "sponsorship",
        STATE_REGION: "CA",
        STATE: "CA",
        TODAYS_DATE: Date.now(), //get new date
        UNKNOWN: "n/a",
        US_AUTH: "Yes", // search for yes
        US_CITIZEN: "",
        US_STATE_SELECTOR: "California",
        VETERAN_DISABILITY: "I don't",
        VETERAN: "I am not",
        WORK_AUTH: "United States Citizen", //can be citizen
        YEARS_EXP: "1",
        ZIP_CODE: "93614",
        ZIP_POST_CODE: "93614",
      };
      const SELECTORS = {
        BASE_PAGE_CLASS: "ia-BasePage-component",
        BASE_PAGE_CLASS_WITH_CONTINUE: "ia-BasePage-component--withContinue",
        QUESTION_ITEM: "ia-Questions-item",
      };

      const getQuestions = (resource) => {
        const questions = [];
        const questionElems = resource.getElementsByClassName(
          SELECTORS.QUESTION_ITEM
        );

        for (const questionElem of questionElems) {
          const textContent = getElementTextContent(questionElem);
          questions.push(textContent);
        }

        // ORIGINAL IMPLEMENTATION
        // for (const questionElem of questionElems) {
        //   const elems = questionElem?.getElementsByTagName("input");
        //   const legend = questionElem?.getElementsByTagName("legend")[0];
        //   const text = legend && legend?.textContent;
        //   let question = { text };
        //   port.postMessage({
        //     status: "debug",
        //     debug: "legend text =" + text,
        //   });

        //   for (let i = 0; i < elems?.length; i++) {
        //     const label = document.querySelector(
        //       "label[for='" + elems[i].id + "']"
        //     );

        //     question[`label${i}`] = label;
        //   }

        //   questions.push(question);
        // }

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
          userId,
          jobPreferences = {},
          currentAppInfo = {},
        } = user ?? {};

        const gotoNext = gotoNextPage();

        if (!gotoNext) {
          const { answers = {} } = currentAppInfo;

          const result = { asyncFuncID: `${messageId}`, jobLinks, error: {} };

          try {
            handleQuestions(jobPreferences, answers);
          } catch (x) {
            if (x.message === "error running form script") {
              port.postMessage({ status: "error running form script" });
            }
            // Make an explicit copy of the Error properties
            result.error = {
              message: x.message,
              arguments: x.arguments,
              type: x.type,
              name: x.name,
              stack: x.stack,
            };

            port.postMessage({ status: "debug", debug: result });
          }
        }
      };

      const setup = async (port, messageId, appInfo) => {
        const user = appInfo?.indeed?.user;
        port.postMessage({ status: "debug", debug: appInfo }); //TODO: we can retrieve appInfo
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
          status: "connection received, handling job form",
        });

        await setup(port, msg.messageId, msg.appInfo);
      };

      let port = chrome.runtime.connect({ name: "handle-job-form" });
      port.postMessage({ status: "connecting handle-job-form messenger" });
      port.onMessage.addListener(async (msg) => {
        switch (msg.response) {
          case "connected":
            await handleConnectedAction(port, msg);
            break;
          case "waiting for actionable message":
            console.log("background did not receive message");
            break;
          default:
            port.postMessage({ status: "waiting for actionable message..." });
        }
      });
    };

    handleForm();
  }
})();
