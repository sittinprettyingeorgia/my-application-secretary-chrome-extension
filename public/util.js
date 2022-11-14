/**
 * Store links in local storage
 * @param newLinks
 */
export const setLinks = async (newLinks) => {
  const jobLinks = Object.keys(newLinks);
  //this will be replaced with call to Go backend
  window.localStorage.setItem(LINKS, JSON.stringify({ jobLinks }));
};
