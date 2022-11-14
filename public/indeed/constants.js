export const HREF = 'href';
export const LINKS = 'links';
// Event types
export const MOUSE = {
  CLICK: 'click',
  DOWN: 'mousedown',
  OVER: 'mouseover',
  UP: 'mouseup',
};

export const HTML_ELEMENT = {
  BUTTON: 'button',
};

//APPLY NOW CONSTANTS | apply-now.js
export const REGEX = {
  CONTAINS_APPS: /\bhttps:\/\/www.indeed.com\/viewjob\b/gi,
  CONTAINS_FORM: /\bhttps:\/\/m5.apply.indeed.com\/\b/gi,
  CONTAINS_JOBS: /\bhttps:\/\/www.indeed.com\/jobs\b/gi,
  JOB_WINDOW: 'https://www.indeed.com/jobs?q=software&l=Remote&fromage=14',
};
export const INDEED_QUERY_SELECTOR = {
  APPLY_BUTTON: '.ia-IndeedApplyButton',
  APPLY_BUTTON_ID: '#indeedApplyButton',
  APPLY_BUTTON_WRAPPER: '.jobsearch-IndeedApplyButton-buttonWrapper',
  APPLY_WIDGET: '.indeed-apply-widget',
  JOB_LINKS: '.jobTitle a',
  NAV_CONTAINER: 'nav[role=navigation',
  PAGINATION_ELEM1: 'a[data-testid=pagination-page-next]',
  PAGINATION_ELEM2: 'a[aria-label=Next]',
};
// local storage
export const KEYS = {
  LINKS: 'links',
  APP_INFO: 'appInfo',
};
// application button text variations
export const APPLY = {
  NOW: 'Apply now',
  APPLIED: 'Applied',
  COMPANY_SITE: 'Apply on company site',
};

// query selector prefix combinations
export const PREFIX = 'data-indeed-apply-';
export const APP_INFO = {
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
  resume: 'resume',
};

//APP FORM CONSTANTS | handle-app-form.js
export const SUBMIT = {
  APPLICATION: 'Submit you application',
  BUTTON: '.ia-continueButton',
  CONTINUE: 'Continue',
  CONTINUE_SELECTOR: 'ia-continueButton',
  RETURN_TO_SEARCH_SELECTOR: '#returnToSearchButton',
  RETURN_TO_SEARCH: 'Return to job search',
  REVIEW_APPLICATION: 'Review you application',
};
export const QUESTIONS = {
  ADDRESS: 'Address',
  AGREE: 'agree',
  BEEN_EMPLOYED: 'Have you ever been employed by', // we need to add company name here.
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
  OPTIONAL: 'optional', // we should skip all optional fields
  POSTAL_CODE: 'Postal Code',
  POSTAL_ZIP: 'Postal/ZIP',
  RACE1: 'Race/Ethnicity',
  RACE2: 'Race or Ethnicity',
  RIGHT_TO_WORK: 'Do you have the right to work in the US',
  SELECTOR1: 'ia-BasePage-component',
  SELECTOR2: 'ia-BasePage-component--withContinue',
  SPONSORSHIP: 'sponsorship', //no
  STATE_REGION: 'State or Region',
  STATE: 'State',
  TODAYS_DATE: "Today's Date",
  UNKNOWN: '', //if unknown select first option
  US_AUTH: 'Are you authorized to work in the United States', // search for yes
  US_CITIZEN: '',
  US_STATE_SELECTOR: '#state__United States__{"DATASOURCE":"CUSTOM_QUESTIONS"}',
  US_VALID: 'valid us citizenship',
  VACCINATED: 'vaccinated',
  VETERAN: 'Veteran status',
  WORK_AUTH: 'Work Authorization',
  YEARS_EXP: 'How many years', // can be multiple questions about experience ie. how many years of java
  ZIP_CODE: 'Zip Code',
  ZIP_POST_CODE: 'Zip/Postal Code',
};
export const ANSWERS = {
  ADDRESS: '34027 CA-41',
  AGREE: 'agree',
  BEEN_EMPLOYED: 'Have you ever been employed by', // we need to add company name here.
  CITY: 'Coarsegold',
  CLEARANCE: 'active security clearance',
  COMMUTE: 'no',
  COMPENSATION: 'compensation',
  COMPETE: 'non-competes',
  COUNTRY: 'United States',
  DATES: 'please list 2-3 dates',
  DESCRIBE_EXP: '', //add description based on language framework etc. or N/A
  DESIRED_PAY: '70000',
  DISABILITY: 'Disability status',
  EDUCATION: "Bachelor's",
  EST_TIME_ZONE: 'No',
  GENDER: 'Male',
  LANGUAGE: 'Do you speak Fluent English',
  NA: 'N/A',
  NAME: 'Mitchell Blake',
  OPTIONAL: 'optional', // we should skip all optional fields
  POSTAL_CODE: '93614',
  POSTAL_ZIP: '93614',
  RACE1: 'Black',
  RACE2: 'Black',
  RIGHT_TO_WORK: 'Yes',
  SPONSORSHIP: 'sponsorship',
  STATE_REGION: 'CA',
  STATE: 'CA',
  TODAYS_DATE: Date.now(), //get new date
  UNKNOWN: 'n/a',
  US_AUTH: 'Yes', // search for yes
  US_CITIZEN: '',
  US_STATE_SELECTOR: 'California',
  VETERAN_DISABILITY: "I don't",
  VETERAN: 'I am not',
  WORK_AUTH: 'United States Citizen', //can be citizen
  YEARS_EXP: '1',
  ZIP_CODE: '93614',
  ZIP_POST_CODE: '93614',
};

// alert that a field is required
export const REQUIRED = {
  ANSWER_THIS: 'Answer this question', //search for input and assign value as checked
};
