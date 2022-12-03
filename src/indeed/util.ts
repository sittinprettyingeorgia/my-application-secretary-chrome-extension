import {
  KEYS,
  HTML_ELEMENT,
  INDEED_QUERY_SELECTOR,
  LINKS,
  HREF,
  MOUSE,
} from './constants';

export const click = async (elem: HTMLElement): Promise<void> => {
  elem.click();
};

export const triggerMouseEvent = (node: EventTarget, eventType: string) => {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
};

export const simulateApplyNow = (applyNowButton: HTMLElement): void => {
  for (const event of Object.values(MOUSE)) {
    triggerMouseEvent(applyNowButton, event);
  }
};
