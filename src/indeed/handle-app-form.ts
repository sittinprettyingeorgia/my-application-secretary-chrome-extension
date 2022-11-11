import {
  LINKS,
  SUBMIT,
  QUESTIONS,
  REGEX,
  KEYS,
  INDEED_QUERY_SELECTOR,
} from './constants';
import {
  setLinks,
  getStoredLinks,
  retrieveElem,
  click,
  deleteHref,
} from './util';

(function() {
  const handleForm = async () => {
    let links: Record<string, string> = {};
    let hrefs: string[] = [];

    await getStoredLinks(links);
    hrefs = [...Object.keys(links)];

    //console.log(Object.keys(JSON.parse(window.localStorage.getItem('links'))));
    //window.localStorage.setItem('links', JSON.stringify({}));

    /**
     *
     * @returns Retrieves stored application information.
     */
    const getAppInfo = () => {
      try {
        const storedAppInfo = window.localStorage.getItem(KEYS.APP_INFO);
        const result = storedAppInfo && JSON.parse(storedAppInfo);
        return result;
      } catch (e) {
        console.log('THERE IS CURRENTLY NO APP INFO');
        console.log(e);
      }

      return undefined;
    };

    /*const handleSubmit = () => {
      if (
        submitButton !== null &&
        submitButton.textContent === SUBMIT.APPLICATION
      ) {
        await click(submitButton);
        alert('we have found a submit button');
      }else if ()
    };*/

    const handleQuestions = (questions: Record<string, string>) => {
      const submitButton = retrieveElem(SUBMIT.BUTTON);
      const questions1 = retrieveElem(QUESTIONS.SELECTOR1);
      const questions2 = retrieveElem(QUESTIONS.SELECTOR2);
      //elem.textContent
      if (questions1 !== null) {
        //We need to loop through each question in questions
      }
    };

    const handleFormInteraction = async () => {
      try {
        let currentUrl: string = window.location.href;

        if (currentUrl.search(REGEX.CONTAINS_FORM) < 0) {
          const hasLink = hrefs.pop();

          if (hasLink) {
            window.location.replace(hasLink);
            currentUrl = hasLink;
          }
        }

        console.log('RUNNING APP SCRIPT', Object.keys(links).length);

        setTimeout(() => {
          handleQuestions(QUESTIONS);
          deleteHref(links, currentUrl);
        }, 2000);
      } catch (e) {
        console.log('Error Running script');
        console.log(e);
      }
    };

    handleFormInteraction();
  };

  handleForm();
})();
