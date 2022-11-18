import { INDEED_QUERY_SELECTOR, HREF, REGEX } from './constants';
import {
  setLinks,
  getStoredLinks,
  retrieveElem,
  retrieveElems,
  click,
} from './util';

const handleLinksRetrieval = async () => {
  const limit = 600;
  let links = getStoredLinks();
  let hrefs = [...Object.keys(links)];
  let endTest = false;

  const getActiveTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };

  const gotoNextPage = async () => {
    const nav = document.querySelector(INDEED_QUERY_SELECTOR.NAV_CONTAINER);
    nav?.scrollIntoView();

    const paginationNext = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM1);
    const paginationNext2 = retrieveElem(
      INDEED_QUERY_SELECTOR.PAGINATION_ELEM2
    );

    if (paginationNext !== null) {
      await click(paginationNext);
    } else if (paginationNext2 !== null) {
      await click(paginationNext2);
    }
  };

  const getPageJobLinks = async () => {
    try {
      chrome.tabs.create({
        url: `${REGEX.JOB_WINDOW}`,
      });
      console.log('we have created a tab');
      throw new Error('test works');
      /*console.log('LINKS LENGTH: before script run ', Object.keys(links));

      const jobLinks = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);

      jobLinks?.forEach((link) => {
        const href = link.getAttribute(HREF);
        if (href) {
          links[href] = href;
        }
      });

      setLinks(links);
      console.log('LINKS LENGTH: after script run ', Object.keys(links));

      await gotoNextPage();*/
    } catch (e) {
      // TODO:
      // This needs to be replaced with an error logging system.
      // preferably stored in json/local db.
      endTest = true;
      console.log('Error Running script');
      console.log(e);
    }
  };

  if (!endTest) {
    await getPageJobLinks();
  } else {
    // TODO:
    // This needs to be replaced with a toast messaging system.
    alert('FINISHED COLLECTING JOBS!!!!!!');
  }
};

/*chrome.runtime.onInstalled.addListener(async () => {
  chrome.tabs.create({
    url: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14',
  });
  return;
});*/

export default handleLinksRetrieval;
