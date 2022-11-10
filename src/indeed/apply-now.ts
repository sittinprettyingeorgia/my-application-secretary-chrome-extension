import { REGEX, APPLY } from './constants';
import { getStoredLinks, setAppInfo, getApplyButton, getNewHref } from './util';

(function () {
  const handleApplication = async () => {
    let links: Record<string, string> = {};

    await getStoredLinks(links);

    //console.log(Object.keys(JSON.parse(window.localStorage.getItem('links'))));
    //window.localStorage.setItem('links', JSON.stringify({}));

    const handleApp = async () => {
      try {
        let currentUrl: string = window.location.href;

        if (currentUrl.search(REGEX.CONTAINS_APPS) < 0) {
          const linksKeys = Object.keys(links);

          if (!linksKeys || linksKeys.length < 1) {
            throw new Error('No links are available');
          }

          currentUrl = linksKeys.pop()!;
          window.location.replace(currentUrl);
        }

        console.log('RUNNING APP SCRIPT', Object.keys(links).length);
        let applyNowButton: HTMLElement | null | undefined;

        setTimeout(() => {
          //we want to wait a second to ensure page scripts have loaded.
          try {
            applyNowButton = getApplyButton(currentUrl, links);
          } catch (e: any) {
            console.log(e.message);
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

  handleApplication();
})();
