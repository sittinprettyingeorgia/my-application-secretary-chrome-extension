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
var constants_1 = require("./constants");
var util_1 = require("./util");
(function () {
    var _this = this;
    var handleForm = function () { return __awaiter(_this, void 0, void 0, function () {
        var links, hrefs, getAppInfo, handleQuestions, handleFormInteraction;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    links = {};
                    hrefs = [];
                    return [4 /*yield*/, (0, util_1.getStoredLinks)(links)];
                case 1:
                    _a.sent();
                    hrefs = __spreadArray([], Object.keys(links), true);
                    getAppInfo = function () {
                        try {
                            var storedAppInfo = window.localStorage.getItem(constants_1.KEYS.APP_INFO);
                            var result = storedAppInfo && JSON.parse(storedAppInfo);
                            return result;
                        }
                        catch (e) {
                            console.log('THERE IS CURRENTLY NO APP INFO');
                            console.log(e);
                        }
                        return undefined;
                    };
                    handleQuestions = function (questions) {
                        var submitButton = (0, util_1.retrieveElem)(constants_1.SUBMIT.BUTTON);
                        var questions1 = (0, util_1.retrieveElem)(constants_1.QUESTIONS.SELECTOR1);
                        var questions2 = (0, util_1.retrieveElem)(constants_1.QUESTIONS.SELECTOR2);
                        //elem.textContent
                        if (questions1 !== null) {
                            //We need to loop through each question in questions
                        }
                    };
                    handleFormInteraction = function () { return __awaiter(_this, void 0, void 0, function () {
                        var currentUrl_1, hasLink;
                        return __generator(this, function (_a) {
                            try {
                                currentUrl_1 = window.location.href;
                                if (currentUrl_1.search(constants_1.REGEX.CONTAINS_FORM) < 0) {
                                    hasLink = hrefs.pop();
                                    if (hasLink) {
                                        window.location.replace(hasLink);
                                        currentUrl_1 = hasLink;
                                    }
                                }
                                console.log('RUNNING APP SCRIPT', Object.keys(links).length);
                                setTimeout(function () {
                                    handleQuestions(constants_1.QUESTIONS);
                                    (0, util_1.deleteHref)(links, currentUrl_1);
                                }, 2000);
                            }
                            catch (e) {
                                console.log('Error Running script');
                                console.log(e);
                            }
                            return [2 /*return*/];
                        });
                    }); };
                    handleFormInteraction();
                    return [2 /*return*/];
            }
        });
    }); };
    handleForm();
})();
