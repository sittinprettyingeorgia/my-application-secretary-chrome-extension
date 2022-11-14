"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.handleLinksRetrieval = void 0;
var constants_1 = require("./constants");
var util_1 = require("./util");
var handleLinksRetrieval = function () { return __awaiter(void 0, void 0, void 0, function () {
    var limit, links, hrefs, gotoNextPage, getPageJobLinks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                limit = 600;
                links = {};
                hrefs = [];
                return [4 /*yield*/, (0, util_1.getStoredLinks)(links)];
            case 1:
                _a.sent();
                hrefs = __spreadArray([], Object.keys(links), true);
                gotoNextPage = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var nav, paginationNext, paginationNext2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                nav = document.querySelector(constants_1.INDEED_QUERY_SELECTOR.NAV_CONTAINER);
                                nav === null || nav === void 0 ? void 0 : nav.scrollIntoView();
                                paginationNext = (0, util_1.retrieveElem)(constants_1.INDEED_QUERY_SELECTOR.PAGINATION_ELEM1);
                                paginationNext2 = (0, util_1.retrieveElem)(constants_1.INDEED_QUERY_SELECTOR.PAGINATION_ELEM2);
                                if (!(paginationNext !== null)) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, util_1.click)(paginationNext)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                if (!(paginationNext2 !== null)) return [3 /*break*/, 4];
                                return [4 /*yield*/, (0, util_1.click)(paginationNext2)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                getPageJobLinks = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var jobLinks;
                    return __generator(this, function (_a) {
                        try {
                            window.location.replace(constants_1.REGEX.JOB_WINDOW);
                            console.log('LINKS LENGTH: before script run ', Object.keys(links));
                            jobLinks = (0, util_1.retrieveElems)(constants_1.INDEED_QUERY_SELECTOR.JOB_LINKS);
                            jobLinks === null || jobLinks === void 0 ? void 0 : jobLinks.forEach(function (link) {
                                var href = link.getAttribute(constants_1.HREF);
                                if (href) {
                                    links[href] = href;
                                }
                            });
                            (0, util_1.setLinks)(links);
                            console.log('LINKS LENGTH: after script run ', Object.keys(links));
                            gotoNextPage();
                        }
                        catch (e) {
                            // TODO:
                            // This needs to be replaced with an error logging system.
                            // preferably stored in json/local db.
                            console.log('Error Running script');
                            console.log(e);
                        }
                        return [2 /*return*/];
                    });
                }); };
                if (hrefs.length < limit) {
                    getPageJobLinks();
                }
                else {
                    // TODO:
                    // This needs to be replaced with a toast messaging system.
                    alert('FINISHED COLLECTING JOBS!!!!!!');
                }
                return [2 /*return*/];
        }
    });
}); };
exports.handleLinksRetrieval = handleLinksRetrieval;
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
