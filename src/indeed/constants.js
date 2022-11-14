"use strict";
exports.__esModule = true;
exports.REQUIRED = exports.ANSWERS = exports.QUESTIONS = exports.SUBMIT = exports.APP_INFO = exports.PREFIX = exports.APPLY = exports.KEYS = exports.INDEED_QUERY_SELECTOR = exports.REGEX = exports.HTML_ELEMENT = exports.MOUSE = exports.LINKS = exports.HREF = void 0;
exports.HREF = 'href';
exports.LINKS = 'links';
// Event types
var MOUSE;
(function (MOUSE) {
    MOUSE["CLICK"] = "click";
    MOUSE["DOWN"] = "mousedown";
    MOUSE["OVER"] = "mouseover";
    MOUSE["UP"] = "mouseup";
})(MOUSE = exports.MOUSE || (exports.MOUSE = {}));
var HTML_ELEMENT;
(function (HTML_ELEMENT) {
    HTML_ELEMENT["BUTTON"] = "button";
})(HTML_ELEMENT = exports.HTML_ELEMENT || (exports.HTML_ELEMENT = {}));
//APPLY NOW CONSTANTS | apply-now.js
exports.REGEX = {
    CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
    CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
    CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
    JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14'
};
var INDEED_QUERY_SELECTOR;
(function (INDEED_QUERY_SELECTOR) {
    INDEED_QUERY_SELECTOR["APPLY_BUTTON"] = ".ia-IndeedApplyButton";
    INDEED_QUERY_SELECTOR["APPLY_BUTTON_ID"] = "#indeedApplyButton";
    INDEED_QUERY_SELECTOR["APPLY_BUTTON_WRAPPER"] = ".jobsearch-IndeedApplyButton-buttonWrapper";
    INDEED_QUERY_SELECTOR["APPLY_WIDGET"] = ".indeed-apply-widget";
    INDEED_QUERY_SELECTOR["JOB_LINKS"] = ".jobTitle a";
    INDEED_QUERY_SELECTOR["NAV_CONTAINER"] = "nav[role=navigation";
    INDEED_QUERY_SELECTOR["PAGINATION_ELEM1"] = "a[data-testid=pagination-page-next]";
    INDEED_QUERY_SELECTOR["PAGINATION_ELEM2"] = "a[aria-label=Next]";
})(INDEED_QUERY_SELECTOR = exports.INDEED_QUERY_SELECTOR || (exports.INDEED_QUERY_SELECTOR = {}));
// local storage
var KEYS;
(function (KEYS) {
    KEYS["LINKS"] = "links";
    KEYS["APP_INFO"] = "appInfo";
})(KEYS = exports.KEYS || (exports.KEYS = {}));
// application button text variations
exports.APPLY = {
    NOW: 'Apply now',
    APPLIED: 'Applied',
    COMPANY_SITE: 'Apply on company site'
};
// query selector prefix combinations
exports.PREFIX = 'data-indeed-apply-';
exports.APP_INFO = {
    apiToken: 'apitoken',
    advNum: 'advnum',
    continueUrl: 'continueurl',
    coverletter: 'coverletter',
    jobUrl: 'joburl',
    postUrl: 'posturl',
    questions: 'questions',
    jK: 'jk',
    jobCompany: 'jobcompanyname',
    jobId: 'jobid',
    jobLocation: 'joblocation',
    jobTitle: 'jobtitle',
    noButtonUI: 'nobuttonui',
    onAppliedStatus: 'onappliedstatus',
    onReady: 'onready',
    phone: 'phone',
    pingbackUrl: 'pingbackurl',
    recentSearchQuery: 'recentsearchquery',
    resume: 'resume'
};
//APP FORM CONSTANTS | handle-app-form.js
exports.SUBMIT = {
    APPLICATION: 'Submit you application',
    BUTTON: '.ia-continueButton',
    CONTINUE: 'Continue',
    CONTINUE_SELECTOR: 'ia-continueButton',
    RETURN_TO_SEARCH_SELECTOR: '#returnToSearchButton',
    RETURN_TO_SEARCH: 'Return to job search',
    REVIEW_APPLICATION: 'Review you application'
};
exports.QUESTIONS = {
    ADDRESS: 'Address',
    AGREE: 'agree',
    BEEN_EMPLOYED: 'Have you ever been employed by',
    CITY: 'City',
    CLEARANCE: 'active security clearance',
    COMMUTE: 'commute',
    COMPENSATION: 'compensation',
    COMPETE: 'non-competes',
    COUNTRY: 'Country',
    DATES: 'please list 2-3 dates',
    DESCRIBE_EXP: 'describe your experience',
    DESIRED_PAY: 'Desired Pay',
    DISABILITY: 'Disability status',
    EDUCATION: 'What is the highest level of education',
    EST_TIME_ZONE: 'Are you currently located',
    GENDER: 'Gender',
    LANGUAGE: 'Do you speak Fluent English',
    NA: 'N/A',
    NAME: 'Your Name',
    OPTIONAL: 'optional',
    POSTAL_CODE: 'Postal Code',
    POSTAL_ZIP: 'Postal/ZIP',
    RACE1: 'Race/Ethnicity',
    RACE2: 'Race or Ethnicity',
    RIGHT_TO_WORK: 'Do you have the right to work in the US',
    SELECTOR1: 'ia-BasePage-component',
    SELECTOR2: 'ia-BasePage-component--withContinue',
    SPONSORSHIP: 'sponsorship',
    STATE_REGION: 'State or Region',
    STATE: 'State',
    TODAYS_DATE: "Today's Date",
    UNKNOWN: '',
    US_AUTH: 'Are you authorized to work in the United States',
    US_CITIZEN: '',
    US_STATE_SELECTOR: '#state__United States__{"DATASOURCE":"CUSTOM_QUESTIONS"}',
    US_VALID: 'valid us citizenship',
    VACCINATED: 'vaccinated',
    VETERAN: 'Veteran status',
    WORK_AUTH: 'Work Authorization',
    YEARS_EXP: 'How many years',
    ZIP_CODE: 'Zip Code',
    ZIP_POST_CODE: 'Zip/Postal Code'
};
exports.ANSWERS = {
    ADDRESS: '34027 CA-41',
    AGREE: 'agree',
    BEEN_EMPLOYED: 'Have you ever been employed by',
    CITY: 'Coarsegold',
    CLEARANCE: 'active security clearance',
    COMMUTE: 'no',
    COMPENSATION: 'compensation',
    COMPETE: 'non-competes',
    COUNTRY: 'United States',
    DATES: 'please list 2-3 dates',
    DESCRIBE_EXP: '',
    DESIRED_PAY: '70000',
    DISABILITY: 'Disability status',
    EDUCATION: "Bachelor's",
    EST_TIME_ZONE: 'No',
    GENDER: 'Male',
    LANGUAGE: 'Do you speak Fluent English',
    NA: 'N/A',
    NAME: 'Mitchell Blake',
    OPTIONAL: 'optional',
    POSTAL_CODE: '93614',
    POSTAL_ZIP: '93614',
    RACE1: 'Black',
    RACE2: 'Black',
    RIGHT_TO_WORK: 'Yes',
    SPONSORSHIP: 'sponsorship',
    STATE_REGION: 'CA',
    STATE: 'CA',
    TODAYS_DATE: Date.now(),
    UNKNOWN: 'n/a',
    US_AUTH: 'Yes',
    US_CITIZEN: '',
    US_STATE_SELECTOR: 'California',
    VETERAN_DISABILITY: "I don't",
    VETERAN: 'I am not',
    WORK_AUTH: 'United States Citizen',
    YEARS_EXP: '1',
    ZIP_CODE: '93614',
    ZIP_POST_CODE: '93614'
};
// alert that a field is required
exports.REQUIRED = {
    ANSWER_THIS: 'Answer this question'
};
