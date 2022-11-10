// TODO:
// Store company info for later data analysis.
// redis may be a good choice for this service. KV store.
// Key: companyName:string, Value: companyInformation: CompanyInformation

// Jobs should be collected during scrape and sent to backend for filtering.
export type Job = Partial<{
  url: string;
  companyName: string;
  position: string;
  salary: number;
}>;

// TODO:
// we will need storage for links previously visited
// so we don't apply to the same place multiple times.
// Key: jobUrl:string, Value: jobInformation: JobInformation
export type Application = Partial<{
  knownQuestions: Record<string, string>;
  unknownQuestions: string[];
}>;

export type User = Partial<{
  userId: string;
  questionsAndAnswers: Record<string, string>;
  salaryReq: number;
  redGreenKeywords: Record<string, string>; // red: fast-paced, green: work-life-balance
}>;
