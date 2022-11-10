import { setLinks } from '../src/service/indeed/util';

/*global chrome*/
chrome.runtime.onInstalled.addListener(() => {
  //we should be setting the initial state of our application here.
  console.log('Chrome extension successfully installed!');
  setLinks();
  return;
});

let active = false;

function makeOrange(color) {
  document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab) => {
  active = !active;
  const color = active ? 'orange' : 'white';
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id ? tab.id : -1 },
      func: makeOrange,
      args: [color],
    })
    .then();
});

// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab: any) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      });
    }
  }
});
