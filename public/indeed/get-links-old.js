const limit = 600;
let links = getStoredLinks();
let hrefs = [...Object.keys(links)];
console.log('insdie get links');

const gotoNextPage = async () => {
  const nav = document.querySelector(INDEED_QUERY_SELECTOR.NAV_CONTAINER);
  nav?.scrollIntoView();

  const paginationNext = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM1);
  const paginationNext2 = retrieveElem(INDEED_QUERY_SELECTOR.PAGINATION_ELEM2);

  if (paginationNext !== null) {
    await click(paginationNext);
  } else if (paginationNext2 !== null) {
    await click(paginationNext2);
  }
};

const getPageJobLinks = async () => {
  try {
    window.location.replace(REGEX.JOB_WINDOW);
    console.log('LINKS LENGTH: before script run ', Object.keys(links));

    const jobLinks = retrieveElems(INDEED_QUERY_SELECTOR.JOB_LINKS);

    jobLinks?.forEach((link) => {
      const href = link.getAttribute(HREF);
      if (href) {
        links[href] = href;
      }
    });

    setLinks(links);
    console.log('LINKS LENGTH: after script run ', Object.keys(links));

    await gotoNextPage();
  } catch (e) {
    // TODO:
    // This needs to be replaced with an error logging system.
    // preferably stored in json/local db.
    console.log('Error Running script');
    console.log(e);
  }
};

if (hrefs.length < limit) {
  console.log('inside');
  //await getPageJobLinks();
} else {
  // TODO:
  // This needs to be replaced with a toast messaging system.
  console.log('FINISHED COLLECTING JOBS!!!!!!');
}

//older
/*
(function () {
  const gotoNext = async (elem) => {
    elem.click();
  };

  const jobWindow = 'https://www.indeed.com/jobs?q=software&l=Remote&start=0';
  const containsJobs = /\bhttps:\/\/www.indeed.com\/jobs\b/gi;

  const getLinks = async () => {
    const limit = 100;
    try {
      let links = {};
      try {
        const temp = JSON.parse(localStorage.getItem('links'));
        if (temp) links = { ...temp };
      } catch (e) {
        console.log('Error retrieving links');
        console.log(e);
      }

      let myWindow = window.location.href;

      if (myWindow.search(containsJobs) < 0) {
        window.location.replace(jobWindow);
      }
      console.log('LINKS LENGTH: before script run ', Object.keys(links));

      if (Object.keys(links).length < limit) {
        const jobLinks = document.querySelectorAll('.jobTitle a');
        jobLinks?.forEach((link) => {
          const href = link.getAttribute('href');
          links[href] = href;
        });

        console.log('LINKS LENGTH: after script run ', Object.keys(links));
        window.localStorage.setItem('links', JSON.stringify(links));

        const nav = document.querySelector('nav[role=navigation');
        nav?.scrollIntoView();

        const paginationNext = document.querySelector(
          'a[data-testid=pagination-page-next]'
        );
        if (paginationNext !== null) {
          await gotoNext(paginationNext);
        } else {
          await gotoNext(document.querySelector('a[aria-label=Next]'));
        }
      }
    } catch (e) {
      console.log('Error Running script');
      console.log(e);
    }
  };

  getLinks();
})();*/
