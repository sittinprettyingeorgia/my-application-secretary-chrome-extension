// TODO:
// Store company info for later data analysis.
// redis may be a good choice for this service. KV store.
// Key: companyName:string, Value: companyInformation: CompanyInformation
import { JobType, Education, ExpLvl, JobPostAgeInDays, Benefit } from './enums';
// this is where our value stream will begin for alternate source of revenue.
// this information should be stored in a data warehouse/lake
export type Qualifications = Partial<{
  angular: number;
  aws: number;
  backEnd: number;
  bash: number;
  c: number;
  cplusplus: number;
  cSharp: number;
  css: number;
  cucumber: number;
  dart: number;
  dotNet: number;
  flutter: number;
  frontEnd: number;
  go: number;
  hibernate: number;
  html: number;
  java: number;
  javascript: number;
  jest: number;
  jpa: number;
  junit: number;
  node: number;
  oop: number;
  postgres: number;
  python: number;
  react_native: number;
  react: number;
  ruby: number;
  rust: number;
  selenium: number;
  spring: number;
  springBoot: number;
  sql: number;
  typescript: number;
  vue: number;
}>;

export type JobPreferences = Partial<{
  jobTypes: JobType[]; //list of jobs a user will accept (part-time, contract, full-time)
  salaryReq: number;
  expLvl: number;
  preferredLocation: string;
  preferredAge: JobPostAgeInDays;
  qualifications: Qualifications;
  education: Education[];
  blacklist: string[]; //list of companies this user does not want to apply for.
  redGreenKeywords: Record<string, string>; // red: fast-paced, green: work-life-balance
  jobLinksLimit: number;
}>;

// Jobs should be collected during scrape and sent to backend for filtering.
export type Job = Partial<{
  url: string;
  companyName: string;
  position: string;
  jobType: JobType;
  salary: number;
  remote: boolean;
  qualifications: Qualifications;
  benefits: Benefit[];
}>;

export type User = Partial<{
  userId: string;
  firstName: string;
  lastName: string;
  questionsAndAnswers: Record<string, string>; // both known(q & a) and unknown(just question no answer)
  JobPreferences: JobPreferences;
  jobLinks: Record<string, string>; // url : url
  jobsApplied: Record<string, Job>; // url : Job TODO: work out data analysis etc later
  jobLinkCollectionInProgress: boolean;
  applyNowInProgress: boolean;
}>;

// TODO:
// we will need storage for links previously visited
// so we don't apply to the same place multiple times. maybe?
// This should store all information for a single user in relation to an application(indeed, ziprecruiter, linkedin, etc)
export type Application = Partial<{
  applicationName: string;
  user: User;
}>;
