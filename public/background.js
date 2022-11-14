import { setLinks } from './util.js';

/*global chrome*/
chrome.runtime.onInstalled.addListener(() => {
  console.log('Chrome extension successfully installed!');
  setLinks();
  return;
});

/**
 * <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js" integrity="sha512-bZS47S7sPOxkjU/4Bt0zrhEtWx0y0CRkhEp8IckzK+ltifIIE9EMIMTuT/mEzoIMewUINruDBIR/jJnbguonqQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <title>Background</title>
</head>
<body>
    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-firestore.js"></script>
    <script src="./scriptmain.bundle.js"></script>
    <script src="./background.js"></script>
</body>
</html>
 */
/* EXAMPLE
var tabid = "";
let indeedTabId;
let maintabid;
let baseUrl = "";
let linkedinBaseUrl = "";
let linkedinTabId;
let linkedinTabId1;
let indeedTabId1;
let ziprecruiterTabId1;
let ziprecruiterTabId;
let ziprecruiterBaseUrl = "";
let debugObj = {};
let datamainlinkedin = {};
let userDetails = {};
let uploadapidebug = null;
let uploadapitoken = null;
let debugSessionJobs = [];
console.log = function () {};
console.info = function () {};
window.confirm = () => true;
if (confirm("OK?")) {
  console.log("Going...");
}

chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(tab);
  console.log("tabid-- " + tab.id);
  maintabid = tab.id;
  chrome.storage.local.set({ maintabid: tab.id }, () => {
    chrome.tabs.create({
      url: chrome.extension.getURL("home.html"),
      selected: true,
    });
  });
});

//uninstall url
chrome.runtime.setUninstallURL(
  "https://docs.google.com/forms/d/e/1FAIpQLSesSYraSHOupjdTFX6NNUC9o65SZ3o46A_E6m6QErBgmEbogQ/viewform",
  () => {
    console.log("extension uninstalled");
  }
);

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return jsonPayload;
}

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.tabs.create({
      url: chrome.extension.getURL("home.html"),
      selected: true,
    });
    console.log("This is a first install!");
  } else if (details.reason == "update") {
    var thisVersion = chrome.runtime.getManifest().version;
    console.log(
      "Updated from " + details.previousVersion + " to " + thisVersion + "!"
    );
    chrome.storage.local.set({
      version: thisVersion,
      previousVersion: details.previousVersion,
    });
  }
});

function resetVariables() {
  tabid = "";
  linkedinTabId = undefined;
  linkedinTabId1 = undefined;
  linkedinBaseUrl = "";
  indeedTabId = undefined;
  indeedTabId1 = undefined;
  baseUrl = "";
  ziprecruiterTabId = undefined;
  ziprecruiterTabId1 = undefined;
  ziprecruiterBaseUrl = "";
  debugObj = {};
  debugSessionJobs = [];
  userDetails = {};
}

function globalReset() {
  console.log("Global Reset");
  chrome?.power?.releaseKeepAwake();
  chrome.storage.local.set(
    {
      uniquesessionid: null,
      linkedinb: 0,
      linkedinData: {},
      linkedinJobLinks: [],
      linkedinLinkNo: 0,
      linkedinLimit: 0,
      linkedinBaseUrl: "",
      linkedinFetchFilters: 0,
      linkedinSkipState: false,
      linkedinPause: false,
      data: {},
      jobLinks: [],
      linkNo: 0,
      limit: 0,
      fetchFilters: 0,
      baseURL: "",
      ziprecruiterb: 0,
      ziprecruiterData: {},
      ziprecruiterJobLinks: [],
      ziprecruiterLinkNo: 0,
      ziprecruiterLimit: 0,
      ziprecruiterBaseUrl: "",
      ziprecruiterApplyButtons: [],
      ziprecruiterPause: false,
    },
    () => {
      console.log("storage resetted");
    }
  );
}

function saveSession(platformName) {
  console.log(platformName, "saveSession");
  if (platformName === "linkedin") {
    console.log("platform is linkedin");
    chrome.runtime.sendMessage({
      linkedin: "true",
      message: "applypage",
      message2: "completed",
    });
  } else if (platformName === "ziprecruiter") {
    console.log("platform is ziprecruiter");
    chrome.runtime.sendMessage({
      ziprecruiter: "true",
      message: "applypage",
      message2: "completed",
    });
  } else {
    chrome.runtime.sendMessage({
      indeed: "true",
      message: "completed",
    });
  }
}

const saveSessionDebug = (obj, platform) => {
  const api = obj.api;
  const token = obj.token;
  delete obj["api"];
  delete obj["token"];
  const body = {
    email: obj.email,
    sessionId: obj.sessionId,
    sessionData: obj[obj.sessionId],
    datamainlinkedin: datamainlinkedin,
    restartSession: {
      jobs: debugSessionJobs,
      email: obj.email,
      sessionId: obj.sessionId,
      platformName:platform
    },
  };

  console.info("finalapicall", datamainlinkedin);

  axios
    .post(api, body, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data, "success");
    })
    .catch((error) => {
      console.log(error.message, "error in getting company emails");
    });
};

chrome.tabs.onRemoved.addListener((tabCurrent, removed) => {
  console.log(
    "tab closed",
    tabCurrent,
    linkedinTabId,
    "tab closed",
    datamainlinkedin
  );
  if (linkedinTabId && tabCurrent == linkedinTabId) {
    console.log("Resetting linkedin");
    chrome?.power?.releaseKeepAwake();
    saveSession("linkedin");
    saveSessionDebug(debugObj, "linkedin");
    resetVariables();
    globalReset();
  } else if (ziprecruiterTabId && tabCurrent == ziprecruiterTabId) {
    console.log("Resetting ziprecruiter");
    chrome?.power?.releaseKeepAwake();
    saveSession("ziprecruiter");
    resetVariables();
    globalReset();
  } else if (indeedTabId && tabCurrent == indeedTabId) {
    console.log("Resetting indeed");
    chrome?.power?.releaseKeepAwake();
    saveSession("indeed");
    saveSessionDebug(debugObj, "indeed");
    resetVariables();
    globalReset();
  }
});

function updateUrl(link, message2) {
  if (link == "index.html") {
    chrome.tabs.remove(parseInt(indeedTabId), function () {
      console.log("Finally Completed");
      if (message2 == "unauthorized") {
        chrome.runtime.sendMessage({ message: "unauthorized" });
      } else chrome.runtime.sendMessage({ message: "completed" });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0];
      if (currTab) {
        // Sanity check
        console.log(currTab);
        chrome.tabs.update(parseInt(indeedTabId), {
          active: true,
          url: link,
          selected: true,
        });
      }
    });
  }
}

function updateUrlDebug(link, debugTabId, message, platform) {
  if (link == "index.html") {
    chrome.tabs.remove(parseInt(debugTabId), function () {
      resetVariables();
      globalReset();
      chrome.runtime.sendMessage({ [platform]: true, message });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0];
      console.log("tabid", currTab);
      if (currTab) {
        chrome.tabs.update(parseInt(debugTabId), {
          active: true,
          url: link,
          selected: true,
        });
      }
    });
  }
}

function executeScripts(tabId, injectDetailsArray) {
  function createCallback(tabId, injectDetails, innerCallback) {
    return function () {
      chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
    };
  }

  var callback = null;

  for (var i = injectDetailsArray.length - 1; i >= 0; --i)
    callback = createCallback(tabId, injectDetailsArray[i], callback);

  if (callback !== null) callback(); // execute outermost function
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    console.log("updated");
    // do your things
    if (tab.url.startsWith("https://www.linkedin.com/in/")) {
      console.log("starts with linkedin");
      executeScripts(null, [
        { file: "./jquery.min.js" },
        { file: "./inject-profile.js" },
        { file: "./profileData.bundle.js" },
      ]);
    }
  }
});

function showAutomationPopup(platformName) {
  let executeScriptId;
  if (platformName === "linkedin") {
    executeScriptId = linkedinTabId;
  } else if (platformName === "ziprecruiter") {
    executeScriptId = ziprecruiterTabId;
  } else {
    executeScriptId = indeedTabId;
  }
  console.log("showAutomationPopup", executeScriptId);
  executeScripts(executeScriptId, [
    { file: "./jquery.min.js" },
    { file: "./inject-template.js" },
    { file: "./popupTemplate.bundle.js" },
  ]);
}

var activeTabId;

chrome.tabs.onActivated.addListener(function (activeInfo) {
  activeTabId = activeInfo.tabId;
});

function showAutomationPopupDebug(platformName) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    console.log("tabs", tabs, tabs?.[0]?.id, platformName);
    if (tabs && tabs.length > 0) {
      executeScripts(tabs?.[0]?.id, [
        { file: "./jquery.min.js" },
        { file: "./inject-template-debug.js" },
        { file: "./debugTemplate.bundle.js" },
      ]);
    } else {
      chrome.tabs.get(activeTabId, function (tab) {
        console.log("tabs0", tab);
        if (tab) {
          executeScripts(tab?.id, [
            { file: "./jquery.min.js" },
            { file: "./inject-template-debug.js" },
            { file: "./debugTemplate.bundle.js" },
          ]);
        } else {
          console.log("No active tab identified.");
        }
      });
    }
  });
}

function pauseAutomation() {
  executeScripts(ziprecruiterTabId, [
    { file: "./inject-template1.js" },
    { file: "./pauseTemplate.bundle.js" },
  ]);
}

function addDebugScript(fnName) {
  const debugTabId = fnName === "FILTERFN" ? indeedTabId1 : indeedTabId;
  executeScripts(debugTabId, [
    { file: "./inject-debugtemplate.js" },
    { file: "./debugTemplateUi.bundle.js" },
  ]);
}

function linkedinUpdateUrl(link, message2) {
  if (link == "index.html") {
    chrome.tabs.remove(parseInt(linkedinTabId), function () {
      console.log("Finally Completed");
      //chrome.runtime.sendMessage({ linkedin: "true", message: "completed" ,message2 : message2});
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0];
      if (currTab) {
        // Sanity check
        console.log(currTab);
        chrome.tabs.update(parseInt(linkedinTabId), {
          active: true,
          url: link,
          selected: true,
        });
      }
    });
  }
}

function ziprecruiterUpdateUrl(link, message2) {
  if (link == "index.html") {
    chrome.tabs.remove(parseInt(ziprecruiterTabId), function () {
      console.log("Finally Completed");
      //chrome.runtime.sendMessage({ linkedin: "true", message: "completed" ,message2 : message2});
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0];
      if (currTab) {
        // Sanity check
        console.log(currTab);
        chrome.tabs.update(parseInt(ziprecruiterTabId), {
          active: true,
          url: link,
          selected: true,
        });
      }
    });
  }
}

const downloadHtml = (platform, htmlContent) => {
  // console.log(userDetails, platform, uploadapidebug, uploadapitoken);
  let blob = new Blob([htmlContent], {
    type: "text/html;charset=utf-8",
  });
  uploadDebug(blob, uploadapidebug, uploadapitoken);
};

chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  console.log(request);
  if ("lazyapply" in request) {
    if (request.message == "check") {
      sendResponse({ status: "installed" });
      return true;
    }
    if (request.message == "auth") {
      chrome.storage.local.set(
        {
          token: request.token,
          user: request.user,
        },
        () => {
          sendResponse("success");
        }
      );
      return true;
    }
    if (request.message == "openpage") {
      //Dont open the page
      chrome.tabs.create({
        url: chrome.extension.getURL("home.html"),
        selected: true,
      });
      sendResponse({ status: "opened" });
      return true;
    }
  }
});

const fn = (message) => {
  if (message === "APPLYFROMHERE_DEBUG_1") {
    console.log("tab close applyfromhere_debug");
    linkedinUpdateUrl("index.html");
  }
};
async function upload(blob, api, token, message = "") {
  const { data } = await axios.get(api, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if ("error" in data) {
    console.log("url not found, some error occured");
    fn(message);
  } else {
    const url = data.url;
    console.log("data", data, data.url);
    axios
      .put(url, blob, {
        headers: {
          "Content-Type": blob.type,
        },
      })
      .then((response) => {
        console.log("blob uploaded successfully", response.data);
        fn(message);
      })
      .catch((error) => {
        console.log("blob uploaded error", error.message);
        fn(message);
      });
  }
}

async function uploadDebug(blob, api, token) {
  const { data } = await axios.get(api, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if ("error" in data) {
    console.log("url not found, some error occured");
  } else {
    const url = data.url;
    console.log("data", data, data.url);
    axios
      .put(url, blob, {
        headers: {
          "Content-Type": blob.type,
        },
      })
      .then((response) => {
        // alert("success");
        console.log("blob uploaded successfully", response.data);
      })
      .catch((error) => {
        // alert("some error occured");
        console.log("blob uploaded error", error.message);
      });
  }
}

let loadcall = 0;
let applycall0 = 0;
let applycall1 = 0;
let applycall3 = 0;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if ("debug" in request && request?.uniquesessionid) {
    if (request.message === "SUBMITAPPLICATION_CALL") {
      console.info("maindatalinkedin0", request.message, request.datamain);
      if (Object.keys(request.datamain).length > 0) {
        const email = Object.keys(request.datamain)[0];
        if ("linkedin" in request.datamain[email]) {
          datamainlinkedin = {
            [email]: {
              linkedin: {
                ...datamainlinkedin?.[email]?.linkedin,
                ...request.datamain[email]?.linkedin,
              },
            },
          };
        } else {
          datamainlinkedin = {
            [email]: {
              indeed: {
                ...datamainlinkedin?.[email]?.indeed,
                ...request.datamain[email]?.indeed,
              },
            },
          };
        }
      }
      console.info("maindatalinkedin", datamainlinkedin);
    }
    if (request.message1 === "SKIP_APPLICATION_CALL") {
      if (Object.keys(request.datamain).length > 0) {
        const email = Object.keys(request.datamain)[0];
        if ("linkedin" in request.datamain[email]) {
          datamainlinkedin = {
            [email]: {
              linkedin: {
                ...datamainlinkedin?.[email]?.linkedin,
                ...request.datamain[email]?.linkedin,
              },
            },
          };
        }
      }
    }
    if (request.message === "START_SESSION") {
      if (Object.keys(request.datamain).length > 0) {
        const email = Object.keys(request.datamain)[0];
        if ("linkedin" in request.datamain[email]) {
          datamainlinkedin = {
            [email]: {
              linkedin: {
                ...datamainlinkedin?.[email]?.linkedin,
                ...request.datamain[email]?.linkedin,
              },
            },
          };
        }
      }
    }
    if (request.message === "SUBMITAPPLICATION_CALL_RESTART") {
      debugSessionJobs.push(request?.link);
      if (Object.keys(request.datamain).length > 0) {
        const email = Object.keys(request.datamain)[0];
        if ("linkedin" in request.datamain[email]) {
          datamainlinkedin = {
            [email]: {
              linkedin: {
                ...datamainlinkedin?.[email]?.linkedin,
                ...request.datamain[email]?.linkedin,
              },
            },
          };
        } else {
          datamainlinkedin = {
            [email]: {
              indeed: {
                ...datamainlinkedin?.[email]?.indeed,
                ...request.datamain[email]?.indeed,
              },
            },
          };
        }
      }
      console.info("maindatalinkedin", datamainlinkedin);
    }

    if (request.message === "ONLOAD_CALL") {
      debugObj.api = request.api;
      debugObj.token = request.token;
      debugObj.sessionId = request.uniquesessionid;
      if (request.uniquesessionid in debugObj) {
        debugObj[request.uniquesessionid].platformName = request.platformName;
        debugObj[request.uniquesessionid][request.message] = request.details;
      } else {
        debugObj[request.uniquesessionid] = {
          [request.message]: request.details,
          platformName: request.platformName,
        };
      }
      console.log("onloadcall", request.details);
    }
    if (request.message === "SETUSERDATA_CALL") {
      debugObj.email = request.email;
      debugObj[request.uniquesessionid].email = request.email;
    } else if (
      request.message === "CHECKSELECTOR_CALL_1" ||
      request.message === "CHECKSELECTOR_CALL"
    ) {
      console.log('joblinkslength', request?.linkedinJobLinks?.length)
      // console.log('linkedinjoblinks', request?.linkedinJobLinks)
      if (request.element) {
        let blob = new Blob([request.element], {
          type: "text/html;charset=utf-8",
        });
        if (applycall3 === 0) {
          applycall3 = 1;
          upload(blob, request.uploadapi, request.token, request.message);
        }
      }
      if (request.uniquesessionid in debugObj) {
        if ("check" in debugObj[request.uniquesessionid]) {
          debugObj[request.uniquesessionid].check.push({
            [request.message]: request.details,
          });
        } else {
          const a = [];
          a.push({
            [request.message]: request.details,
          });
          debugObj[request.uniquesessionid].check = a;
        }
      }
    } else if (
      request.message === "APPLYFROMHERE_CALL" ||
      request.message === "APPLYFROMHERE_DEBUG_1"
    ) {
      if (request.element) {
        let blob = new Blob([request.element], {
          type: "text/html;charset=utf-8",
        });
        if (applycall1 === 0) {
          applycall1 = 1;
          upload(blob, request.uploadapi, request.token, request.message);
        }
      }
      debugObj[request.uniquesessionid][request.message] = request.details;
    } else if (request.message === "APPLYFROMHERE_DEBUG_0") {
      if (request.element) {
        let blob = new Blob([request.element], {
          type: "text/html;charset=utf-8",
        });
        if (applycall0 === 0) {
          applycall0 = 1;
          upload(blob, request.uploadapi, request.token, request.message);
        }
      }
      debugObj[request.uniquesessionid][request.message] = request.details;
    } else {
      debugObj[request.uniquesessionid][request.message] = request.details;
    }
  }
  if ("profileData" in request) {
    if (request.message == "getCompanyDomains") {
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse(response.data);
        })
        .catch((error) => {
          console.log(error.message, "error in getting company domains");
          sendResponse([]);
        });
      return true;
    } else if (request.message == "getCompanyEmails") {
      axios
        .post(
          request.api,
          JSON.stringify({
            to_emails: request.result,
          })
        )
        .then((response) => {
          console.log(response.data);
          sendResponse(response.data);
        })
        .catch((error) => {
          console.log(error.message, "error in getting company emails");
          sendResponse([]);
        });
      return true;
    } else if (request.message == "openViewEmails") {
      chrome.tabs.create({
        url: chrome.extension.getURL("home.html"),
        selected: true,
      });
    } else if (request.message == "getCompanyEmailsFromApollo") {
      axios
        .post(request.api, request.data, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse(response.data);
        })
        .catch((error) => {
          console.log(error.message, "error in getting company emails");
          sendResponse({ errorMessage: error?.message });
        });
      return true;
    } else if (request.message == "openExtension") {
      chrome.tabs.create({
        url: chrome.extension.getURL("home.html"),
        selected: true,
      });
    }
  } else if ("linkedin" in request) {
    // { baseURL: url,linkedinLimit: numberOfJobs.value, linkedinJobLinks: []},
    if (!("message" in request)) {
      console.log(
        "Background script has received a message from contentscript:'" +
          request.linkedinCount +
          "'"
      );
      console.log("currentpage -->" + request.linkedinCount);
      console.log(request.linkedinData);
      console.log("limit -->" + request.linkedinLimit);

      linkedinUpdateUrl(
        `${linkedinBaseUrl}&start=${request.linkedinCount * 25}`
      );
      return true;
    } else if (request.message == "tabid") {
      chrome?.power?.requestKeepAwake("display");
      console.log("save filter id", request.tabID);
      linkedinTabId1 = request.tabID;
    } else if (request.message == "showFillDetailsMessage") {
      chrome.tabs.sendMessage(linkedinTabId, {
        linkedin: "true",
        message: "showFillDetailsMessage",
        name: request.name,
        text: request?.text || "",
      });
    } else if (request.message == "hideFillDetailsMessage") {
      chrome.tabs.sendMessage(linkedinTabId, {
        linkedin: "true",
        message: "hideFillDetailsMessage",
      });
    } else if (request.message == "showAutomationButtons") {
      chrome.tabs.sendMessage(linkedinTabId, {
        linkedin: "true",
        message: "showAutomationButtons",
        message1: request?.message1 || "",
      });
    } else if (request.message == "executeScript") {
      showAutomationPopup("linkedin");
      pauseAutomation();
    } else if (request.message == "executeScriptDebug") {
      showAutomationPopupDebug("linkedin");
      userDetails = request.data;
      uploadapidebug = request.uploadapi;
      uploadapitoken = request.token;
    } else if (request.message == "downloadHtmlFile") {
      downloadHtml("linkedin", request.htmlContent);
    } else if (request.message == "saveSession") {
      if ("message2" in request && request.message2 == "quitclicked") {
        console.log("quit");
        chrome.tabs.remove(parseInt(linkedinTabId), function () {
          console.log("Finally closed tab zip");
        });
      } else {
        saveSession("linkedin");
      }
    } else if (request.message == "Save job links in db") {
      axios
        .post(
          request.api,
          {
            linkedinTotalLinks: request.linkedinTotalLinks,
          },
          {
            headers: { Authorization: `Bearer ${request.token}` },
          }
        )
        .then(function (response) {
          console.log(response.data);
          if (response.data == "no data") {
            console.log("nooooo dataaaaa");
            sendResponse("no data");
          } else {
            console.log("elseeee linkedintotallinks");
            console.log(response.data.linkedinTotalLinks);
            sendResponse({
              linkedinTotalLinks: response.data.linkedinTotalLinks,
            });
          }
        })
        .catch(function (error) {
          sendResponse({ error: "ok" });
          console.log(error);
        });
      return true;
    } else if (request.message == "setBaseUrl") {
      linkedinTabId = request.linkedinTabID;
      linkedinBaseUrl = request.linkedinBaseUrl;
      console.log(linkedinBaseUrl, linkedinTabId);
      console.log("base url setted");
    } else if (request.message == "deubgApplyPage") {
      window.analytics.track(
        "USER_DEBUG_LINKEDIN",
        {
          label: "debug sessin",
          fnName: request.fnName,
          data: parseJwt(request.token),
        },
        {},
        () => {
          console.log("success call analytics");
        }
      );
      console.log("tabidyo", linkedinTabId1, linkedinTabId);
      let debugTabId =
        request.whichTabId == "first" ? linkedinTabId1 : linkedinTabId;
      if (linkedinTabId) {
        debugTabId = linkedinTabId;
      }
      updateUrlDebug(request.link, debugTabId, request.message2, "linkedin");
      return true;
    } else if (request.message == "debugScript") {
      uploadapidebug = request.uploadapi;
      uploadapitoken = request.token;
    } else if (request.message == "applypage") {
      console.log("apply page");
      linkedinUpdateUrl(request.link, request.message2);
      return true;
    } else if (request.message == "applypagedebug") {
      console.log("apply page");
      linkedinUpdateUrl(request.link, request.message2);
      return true;
    } else if (request.message == "getUserData") {
      console.log("Get user data, linkedincall");
      console.log("axios call");
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
          sendResponse(error);
        });
      return true;
    } else if (request.message == "getSessionLinks") {
      console.log("Get session links, linkedincall");
      console.log("axios call", request);
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
          sendResponse(error);
        });
      return true;
    } else if (request.message == "Applied successfully") {
      if (request.message1 == "hideAutomationButtons") {
        chrome.tabs.sendMessage(linkedinTabId, {
          linkedin: "true",
          message: "hideAutomationButtons",
        });
      }
      sendResponse("Updated the count on the frontend along with links");
    } else if (request.message == "Already Applied Before") {
      sendResponse("Already applied before now restart");
    } else if (request.message == "hideAutomationButtonsOnly") {
      chrome.tabs.sendMessage(linkedinTabId, {
        linkedin: "true",
        message: "hideAutomationButtons",
      });
    } else if (request.message == "filterValues") {
      console.log(linkedinTabId1, "fetch filters complete");
      chrome.tabs.remove(linkedinTabId1, function () {
        console.log("filters fetched ---- closed linkedin url");
      });
    } else {
      console.log("nothing to do");
    }
    return true;
  } else if ("ziprecruiter" in request) {
    if (!("message" in request)) {
      console.log(
        "Background script has received a message from contentscript:'" +
          request.linkedinCount +
          "'"
      );
      console.log("currentpage -->" + request.linkedinCount);
      console.log(request.linkedinData);
      console.log("limit -->" + request.linkedinLimit);

      linkedinUpdateUrl(
        `${linkedinBaseUrl}&start=${request.linkedinCount * 25}`
      );
      return true;
    } else if (request.message == "resetwhy") {
      console.log("reset why", request.flow);
    } else if (request.message == "showpopup") {
      console.log("showpopup", request);
    } else if (request.message == "showFillDetailsMessage") {
      chrome.tabs.sendMessage(ziprecruiterTabId, {
        ziprecruiter: "true",
        message: "showFillDetailsMessage",
        name: request.name,
      });
    } else if (request.message == "hideFillDetailsMessage") {
      chrome.tabs.sendMessage(ziprecruiterTabId, {
        ziprecruiter: "true",
        message: "hideFillDetailsMessage",
      });
    } else if (request.message == "showAutomationButtons") {
      chrome.tabs.sendMessage(ziprecruiterTabId, {
        ziprecruiter: "true",
        message: "showAutomationButtons",
      });
    } else if (request.message == "tabid") {
      chrome?.power?.requestKeepAwake("display");
      console.log("save filter id", request.tabID);
      ziprecruiterTabId1 = request.tabID;
    } else if (request.message == "executeScript") {
      showAutomationPopup("ziprecruiter");
      pauseAutomation();
    } else if (request.message == "executeScriptDebug") {
      showAutomationPopupDebug("ziprecruiter");
      userDetails = request.data;
      uploadapidebug = request.uploadapi;
      uploadapitoken = request.token;
    } else if (request.message == "downloadHtmlFile") {
      downloadHtml("ziprecruiter", request.htmlContent);
    } else if (request.message == "saveSession") {
      if ("message2" in request && request.message2 == "quitclicked") {
        console.log("quit");
        chrome.tabs.remove(parseInt(ziprecruiterTabId), function () {
          console.log("Finally closed tab zip");
        });
      } else {
        saveSession("ziprecruiter");
      }
    } else if (request.message == "Save job links in db") {
      axios
        .post(
          request.api,
          {
            ziprecruiterTotalLinks: request.ziprecruiterTotalLinks,
          },
          {
            headers: { Authorization: `Bearer ${request.token}` },
          }
        )
        .then(function (response) {
          console.log(response.data);
          if (response.data == "no data") {
            console.log("nooooo dataaaaa");
            sendResponse("no data");
          } else {
            console.log("elseeee ziprecruitertotallinks");
            console.log(response.data.ziprecruiterTotalLinks);
            sendResponse({
              ziprecruiterTotalLinks: response.data.ziprecruiterTotalLinks,
            });
          }
        })
        .catch(function (error) {
          sendResponse({ error: "ok" });
          console.log(error);
        });
      return true;
    } else if (request.message == "setBaseUrl") {
      ziprecruiterTabId = request.ziprecruiterTabID;
      ziprecruiterBaseUrl = request.ziprecruiterBaseUrl;
      console.log(ziprecruiterBaseUrl, ziprecruiterTabId);
      console.log("base url setted");
    } 
    else if (request.message == "getSessionLinks") {
      console.log("Get session links, ziprecruitercall");
      console.log("axios call", request);
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
          sendResponse(error);
        });
      return true;
    } 
    else if (request.message == "applypage") {
      console.log("apply page");
      ziprecruiterUpdateUrl(request.link, request.message2);
      return true;
    } else if (request.message == "deubgApplyPage") {
      window.analytics.track(
        "USER_DEBUG_ZIPRECRUITER",
        {
          label: "debug sessin",
          fnName: request.fnName,
          data: parseJwt(request.token),
        },
        {},
        () => {
          console.log("success call analytics");
        }
      );
      let debugTabId =
        request.whichTabId == "first" ? ziprecruiterTabId1 : ziprecruiterTabId;
      if (ziprecruiterTabId) {
        debugTabId = ziprecruiterTabId;
      }
      updateUrlDebug(request.link, debugTabId, request.message2, "ziprecruiter");
      return true;
    } else if (request.message == "debugScript") {
      uploadapidebug = request.uploadapi;
      uploadapitoken = request.token;
    } else if (request.message == "getUserData") {
      console.log("Get user data, ziprecruitercall");
      console.log("axios call");
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
          sendResponse(error);
        });
      return true;
    } else if (request.message == "Applied successfully") {
      if (request.message1 == "hideAutomationButtons") {
        chrome.tabs.sendMessage(ziprecruiterTabId, {
          ziprecruiter: "true",
          message: "hideAutomationButtons",
        });
      }
      sendResponse("Updated the count on the frontend along with links");
    } else if (request.message == "hideAutomationButtonsOnly") {
      chrome.tabs.sendMessage(ziprecruiterTabId, {
        ziprecruiter: "true",
        message: "hideAutomationButtons",
      });
    } else if (request.message == "filterValues") {
      console.log(ziprecruiterTabId1, "fetch filters complete");
      chrome.tabs.remove(ziprecruiterTabId1, function () {
        console.log("filters fetched ---- closed linkedin url");
      });
    } else {
      console.log("nothing to do");
    }
    return true;
  } else {
    if (!("message" in request)) {
      console.log(
        "Background script has received a message from contentscript:'" +
          request.count +
          "'"
      );
      console.log("currentpage -->" + request.count);
      console.log(request.data);
      console.log("limit -->" + request.limit);

      updateUrl(`${baseUrl}&start=${request.count * 10}`);
      return true;
    } else if (request.message == "tabid") {
      chrome?.power?.requestKeepAwake("display");
      console.log("save filter id", request.tabID);
      indeedTabId1 = request.tabID;
    } else if (request.message == "executeScript") {
      showAutomationPopup("indeed");
    } else if (request.message == "downloadHtmlFile") {
      console.log("download file");
      downloadHtml("indeed", request.htmlContent);
    } else if (request.message == "executeScriptDebug") {
      showAutomationPopupDebug("indeed");
      userDetails = request.data;
      uploadapidebug = request.uploadapi;
      uploadapitoken = request.token;
    } else if (request.message == "debugScript") {
      uploadapidebug = request.uploadapi;
      uploadapitoken = request.token;
      // addDebugScript(request.name);
    } else if (request.message == "saveSession") {
      saveSession("indeed");
    } else if (request.message == "Save job links in db") {
      axios
        .post(
          request.api,
          {
            totalLinks: request.totalLinks,
          },
          {
            headers: { Authorization: `Bearer ${request.token}` },
          }
        )
        .then(function (response) {
          console.log(response.data);
          if (response.data == "no data") {
            console.log("nooooo dataaaaa");
            sendResponse("no data");
          } else {
            console.log("elseeee indeedtotallinks");
            console.log(response.data.totalLinks);
            sendResponse({
              totalLinks: response.data.totalLinks,
            });
          }
        })
        .catch(function (error) {
          sendResponse({ error: "ok" });
          console.log(error);
        });
      return true;
    } else if (request.message == "getSessionLinks") {
      console.log("Get session links, indeedcall");
      console.log("axios call", request);
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
          sendResponse(error);
        });
      return true;
    } else if (request.message == "applypage") {
      updateUrl(request.link, request.message2);
      //sendResponse("ok");
      return true;
    } else if (request.message == "Already Applied Before") {
      sendResponse("Already applied before now restart");
    } else if (request.message == "deubgApplyPage") {
      window.analytics.track(
        "USER_DEBUG",
        {
          label: "debug sessin",
          fnName: request.fnName,
          data: parseJwt(request.token),
        },
        {},
        () => {
          console.log("success call analytics");
        }
      );
      console.log("tabidyo", indeedTabId1, indeedTabId);
      let debugTabId =
        request.whichTabId == "first" ? indeedTabId1 : indeedTabId;
      if (indeedTabId) {
        debugTabId = indeedTabId;
      }
      updateUrlDebug(request.link, debugTabId, request.message2, "indeed");
      return true;
    } else if (request.message == "getUserData") {
      console.log("Get user data, indeed call");
      console.log("axios call");
      console.log(request.token);
      axios
        .get(request.api, {
          headers: { Authorization: `Bearer ${request.token}` },
        })
        .then((response) => {
          console.log(response.data);
          sendResponse({ data: response.data });
        })
        .catch((error) => {
          console.log(error);
          sendResponse(error);
        });
      return true;
    } else if (request.message == "Applied successfully") {
      sendResponse("Updated the count on the frontend along with links");
    } else if (request.message == "filterValues") {
      console.log(indeedTabId1, "fetch filters complete");
      chrome.tabs.remove(indeedTabId1, function () {
        console.log("filters fetched ---- closed indeed url");
      });
    } else if (request.message == "setBaseUrl") {
      indeedTabId = request.tabID;
      baseUrl = request.baseURL;
      console.log(baseUrl);
      console.log("base url setted");
    } else if (request.message == "restartCycle") {
      console.log(request.jobLinks);
      console.log(request.linkNo);
    } else {
      console.log("ok");
      return true;
      // sendResponse("ok");
    }
  }
});

*/
