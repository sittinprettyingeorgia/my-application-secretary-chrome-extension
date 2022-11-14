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
exports.__esModule = true;
var constants_1 = require("./constants");
var util_1 = require("./util");
(function () {
    var _this = this;
    var handleApplication = function () { return __awaiter(_this, void 0, void 0, function () {
        var links, handleApp;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    links = {};
                    return [4 /*yield*/, (0, util_1.getStoredLinks)(links)];
                case 1:
                    _a.sent();
                    handleApp = function () { return __awaiter(_this, void 0, void 0, function () {
                        var currentUrl_1, linksKeys, applyNowButton_1;
                        return __generator(this, function (_a) {
                            try {
                                currentUrl_1 = window.location.href;
                                if (currentUrl_1.search(constants_1.REGEX.CONTAINS_APPS) < 0) {
                                    linksKeys = Object.keys(links);
                                    if (!linksKeys || linksKeys.length < 1) {
                                        throw new Error('No links are available');
                                    }
                                    currentUrl_1 = linksKeys.pop();
                                    window.location.replace(currentUrl_1);
                                }
                                console.log('RUNNING APP SCRIPT', Object.keys(links).length);
                                setTimeout(function () {
                                    //we want to wait a second to ensure page scripts have loaded.
                                    try {
                                        applyNowButton_1 = (0, util_1.getApplyButton)(currentUrl_1, links);
                                    }
                                    catch (e) {
                                        console.log(e);
                                        currentUrl_1 = (0, util_1.getNewHref)(currentUrl_1, links);
                                    }
                                    if (applyNowButton_1 !== null &&
                                        (applyNowButton_1 === null || applyNowButton_1 === void 0 ? void 0 : applyNowButton_1.textContent) === constants_1.APPLY.NOW) {
                                        currentUrl_1 && (0, util_1.setAppInfo)(currentUrl_1);
                                        applyNowButton_1.click();
                                    }
                                }, 1000);
                            }
                            catch (e) {
                                console.log('Error Running script');
                                console.log(e);
                            }
                            return [2 /*return*/];
                        });
                    }); };
                    handleApp();
                    return [2 /*return*/];
            }
        });
    }); };
    handleApplication();
})();
