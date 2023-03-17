const express = require("express");
const { tmpQuestions } = require("./tmp");
const { NlpManager } = require("node-nlp");
const { dockStart } = require("@nlpjs/basic");
const axios = require("axios");
const { personalCorpus } = require("../corpus/personal");
const { updateUser } = require("../graphql/mutations");
const { handleResponse } = require("../util/index.js");

const router = express.Router();
const authMode = "API_KEY";

// TODO: store themes in a database somewhere
const themesBeforeDeDupe = [
  { theme: "age", keywords: ["age", "at least 18"] },
  { theme: "aws", keywords: ["aws"] },
  { theme: "backgroundCheck", keywords: ["background check"] },
  { theme: "citizenship", keywords: ["work authorization", "citizenship"] },
  { theme: "city", keywords: ["city"] },
  {
    theme: "clearance",
    keywords: [
      "dod security clearance",
      "obtain and maintain security clearance",
    ],
  },
  {
    theme: "contact",
    keywords: [
      "method of contact",
      "contacting me via text message",
      "receive email notifications",
    ],
  },
  { theme: "containerization", keywords: ["containerization"] },
  { theme: "country", keywords: ["country"] },
  { theme: "date", keywords: ["date", "today's date"] },
  {
    theme: "disability",
    keywords: ["disability", "self-identification of disability"],
  },
  { theme: "earliestAvailable", keywords: ["earliest available"] },
  {
    theme: "education",
    keywords: ["bachelor's degree", "highest education level", "education"],
  },
  { theme: "english", keywords: ["speak english"] },
  { theme: "gender", keywords: ["gender"] },
  { theme: "git", keywords: ["git"] },
  { theme: "graduateYear", keywords: ["year graduated"] },
  { theme: "java", keywords: ["java"] },
  { theme: "microservices", keywords: ["microservices"] },
  {
    theme: "name",
    keywords: [
      "name",
      "full name",
      "first name",
      "last name",
      "signature",
      " i certify that answers given herein are true, accurate, and complete to the best of my knowledge.",
    ],
  },
  {
    theme: "notice",
    keywords: [
      "notice employer",
      "time frame to start new position",
      "notice to your employer",
    ],
  },
  {
    theme: "race",
    keywords: ["ethnicity", "race", "ethnic background", "race/ethnicity"],
  },
  { theme: "react", keywords: ["react"] },
  {
    theme: "referral",
    keywords: [
      "referral",
      "Were you referred by anyone",
      "person who referred you",
    ],
  },
  {
    theme: "salary",
    keywords: [
      "compensation",
      "salary",
      "desired pay",
      "desired annual salary",
    ],
  },
  { theme: "school", keywords: ["school name"] },
  { theme: "softwareEngineering", keywords: ["software engineering"] },
  { theme: "springBoot", keywords: ["spring boot"] },
  { theme: "state", keywords: ["state"] },
  {
    theme: "streetAddress",
    keywords: ["street address", "address", "home address"],
  },
  { theme: "vaccine", keywords: ["vaccine", "are you vaccinated"] },
  { theme: "veteran", keywords: ["veteran status"] },
  { theme: "zipAddress", keywords: ["zip/postal", "zip", "postal"] },
  { theme: "aws", keywords: ["aws"] },
  { theme: "azure", keywords: ["azure"] },
  { theme: "bootstrap", keywords: ["bootstrap"] },
  { theme: "c", keywords: ["c"] },
  { theme: "c++", keywords: ["c++"] },
  { theme: "c#", keywords: ["c#"] },
  { theme: "cloud", keywords: ["cloud"] },
  { theme: "css", keywords: ["css"] },
  { theme: "docker", keywords: ["docker"] },
  { theme: "git", keywords: ["git"] },
  { theme: "go", keywords: ["go"] },
  { theme: "html", keywords: ["html"] },
  { theme: "java", keywords: ["java"] },
  { theme: "javascript", keywords: ["javascript"] },
  { theme: "jquery", keywords: ["jquery"] },
  { theme: "json", keywords: ["json"] },
  { theme: "kubernetes", keywords: ["kubernetes"] },
  { theme: "linux", keywords: ["linux"] },
  { theme: "machineLearning", keywords: ["machine learning"] },
  { theme: "mongodb", keywords: ["mongodb"] },
  { theme: "mysql", keywords: ["mysql"] },
  { theme: "nodejs", keywords: ["nodejs"] },
  { theme: "oracle", keywords: ["oracle"] },
  { theme: "php", keywords: ["php"] },
  { theme: "python", keywords: ["python"] },
  { theme: "react", keywords: ["react"] },
  { theme: "ruby", keywords: ["ruby"] },
  { theme: "scala", keywords: ["scala"] },
  { theme: "spring", keywords: ["spring"] },
  { theme: "sql", keywords: ["sql"] },
  { theme: "typescript", keywords: ["typescript"] },
  { theme: "vue", keywords: ["vue"] },
  { theme: "web", keywords: ["web"] },
  { theme: "wordpress", keywords: ["wordpress"] },
  { theme: "agile", keywords: ["agile"] },
  { theme: "analysis", keywords: ["analysis"] },
  { theme: "android", keywords: ["android"] },
  { theme: "api", keywords: ["api"] },
  { theme: "app", keywords: ["app"] },
  { theme: "architecture", keywords: ["architecture"] },
  { theme: "automation", keywords: ["automation"] },
  { theme: "awsLambda", keywords: ["aws lambda"] },
  { theme: "backend", keywords: ["backend"] },
  { theme: "bigData", keywords: ["big data"] },
  { theme: "cloudComputing", keywords: ["cloud computing"] },
  { theme: "coding", keywords: ["coding"] },
  { theme: "database", keywords: ["database"] },
  { theme: "dataScience", keywords: ["data science"] },
  { theme: "devOps", keywords: ["devops"] },
  { theme: "django", keywords: ["django"] },
  { theme: "dockerCompose", keywords: ["docker-compose"] },
  { theme: "embeddedSystems", keywords: ["embedded systems"] },
  { theme: "frontend", keywords: ["frontend"] },
  { theme: "fullStack", keywords: ["full stack"] },
  { theme: "angular", keywords: ["angular"] },
  { theme: "api", keywords: ["api"] },
  { theme: "architecture", keywords: ["architecture"] },
  { theme: "authorization", keywords: ["authorization"] },
  { theme: "azure", keywords: ["azure"] },
  { theme: "backend", keywords: ["backend"] },
  { theme: "cloud", keywords: ["cloud"] },
  { theme: "communication", keywords: ["communication"] },
  { theme: "database", keywords: ["database"] },
  { theme: "debugging", keywords: ["debugging"] },
  { theme: "docker", keywords: ["docker"] },
  { theme: "frontend", keywords: ["frontend"] },
  { theme: "javascript", keywords: ["javascript"] },
  { theme: "jquery", keywords: ["jquery"] },
  { theme: "mvc", keywords: ["mvc"] },
  { theme: "nodejs", keywords: ["node.js"] },
  { theme: "oop", keywords: ["oop", "object oriented programming"] },
  { theme: "rest", keywords: ["rest", "restful"] },
  { theme: "security", keywords: ["security"] },
  { theme: "testing", keywords: ["testing"] },
  { theme: "api", keywords: ["API", "REST", "GraphQL"] },
  {
    theme: "authentication",
    keywords: ["authentication", "authorization", "OAuth", "OpenID Connect"],
  },
  { theme: "awsLambda", keywords: ["AWS Lambda", "serverless"] },
  {
    theme: "backend",
    keywords: ["backend", "server", "database", "ORM", "SQL", "NoSQL"],
  },
  { theme: "browser", keywords: ["browser", "HTML", "CSS", "JavaScript"] },
  { theme: "cache", keywords: ["cache", "Redis", "Memcached"] },
  {
    theme: "cloud",
    keywords: ["cloud computing", "AWS", "Azure", "Google Cloud"],
  },
  {
    theme: "codeQuality",
    keywords: ["code quality", "linting", "testing", "coverage"],
  },
  { theme: "codingStyle", keywords: ["coding style", "best practices"] },
  {
    theme: "communication",
    keywords: ["communication", "collaboration", "teamwork"],
  },
  { theme: "containers", keywords: ["containers", "Docker", "Kubernetes"] },
  {
    theme: "continuousIntegration",
    keywords: ["continuous integration", "Jenkins", "Travis CI", "CircleCI"],
  },
  { theme: "crypto", keywords: ["cryptography", "encryption", "hashing"] },
  {
    theme: "cssFramework",
    keywords: ["CSS framework", "Bootstrap", "Materialize", "Bulma"],
  },
  {
    theme: "dataAnalysis",
    keywords: ["data analysis", "data visualization", "matplotlib", "D3.js"],
  },
  {
    theme: "dataScience",
    keywords: ["data science", "machine learning", "AI", "deep learning"],
  },
  {
    theme: "databaseDesign",
    keywords: ["database design", "schema", "ER diagram"],
  },
  { theme: "debugging", keywords: ["debugging", "logging", "error handling"] },
  { theme: "deployment", keywords: ["deployment", "CD/CI", "DevOps"] },
  {
    theme: "designPatterns",
    keywords: ["design patterns", "MVC", "Observer", "Singleton"],
  },
  {
    theme: "devEnvironment",
    keywords: [
      "development environment",
      "IDE",
      "text editor",
      "version control",
    ],
  },
  {
    theme: "devOps",
    keywords: ["DevOps", "AWS DevOps", "Azure DevOps", "Google Cloud DevOps"],
  },
  { theme: "docker", keywords: ["Docker", "containerization", "Dockerfile"] },
  {
    theme: "documentation",
    keywords: ["documentation", "JSDoc", "API reference", "README"],
  },
  { theme: "ec2", keywords: ["EC2", "Elastic Compute Cloud"] },
  {
    theme: "elasticSearch",
    keywords: ["Elasticsearch", "search engine", "indexing"],
  },
  {
    theme: "encryption",
    keywords: ["encryption", "decryption", "cryptography"],
  },
  {
    theme: "frontend",
    keywords: ["frontend", "web development", "React", "Angular", "Vue.js"],
  },
  {
    theme: "fullStack",
    keywords: ["full-stack", "MEAN stack", "MERN stack", "LAMP stack"],
  },
  { theme: "git", keywords: ["Git", "version control", "GitHub", "GitLab"] },
  { theme: "graphql", keywords: ["GraphQL", "API"] },
  { theme: "html", keywords: ["HTML", "web development"] },
  { theme: "internship", keywords: ["internship"] },
  { theme: "javascript", keywords: ["javascript"] },
  { theme: "jobTitle", keywords: ["job title"] },
  { theme: "jquery", keywords: ["jquery"] },
  { theme: "language", keywords: ["language"] },
  { theme: "location", keywords: ["location"] },
  { theme: "machineLearning", keywords: ["machine learning"] },
  { theme: "management", keywords: ["management"] },
  { theme: "methodology", keywords: ["methodology", "agile methodology"] },
  { theme: "mobile", keywords: ["mobile", "mobile app"] },
  { theme: "mysql", keywords: ["mysql"] },
  { theme: "nodejs", keywords: ["node.js"] },
  { theme: "objectOriented", keywords: ["object oriented programming", "oop"] },
  { theme: "office", keywords: ["microsoft office", "office suite"] },
  { theme: "openSource", keywords: ["open source"] },
  { theme: "operatingSystem", keywords: ["operating system"] },
  { theme: "oracle", keywords: ["oracle"] },
  { theme: "performance", keywords: ["performance"] },
  { theme: "postgresql", keywords: ["postgresql"] },
  { theme: "problemSolving", keywords: ["problem solving"] },
  { theme: "programming", keywords: ["programming"] },
  { theme: "projectManagement", keywords: ["project management"] },
  { theme: "python", keywords: ["python"] },
  { theme: "qualityAssurance", keywords: ["quality assurance"] },
  { theme: "reactNative", keywords: ["react native"] },
  { theme: "restApi", keywords: ["rest api"] },
  { theme: "ruby", keywords: ["ruby"] },
  { theme: "salesforce", keywords: ["salesforce"] },
  { theme: "scrum", keywords: ["scrum"] },
  { theme: "security", keywords: ["security"] },
  { theme: "server", keywords: ["server"] },
  { theme: "softwareArchitecture", keywords: ["software architecture"] },
  { theme: "softwareDevelopment", keywords: ["software development"] },
  { theme: "softwareTesting", keywords: ["software testing"] },
  { theme: "sourceControl", keywords: ["source control"] },
  { theme: "sql", keywords: ["sql"] },
  { theme: "statistics", keywords: ["statistics"] },
  { theme: "swift", keywords: ["swift"] },
  { theme: "teamwork", keywords: ["teamwork"] },
  { theme: "terraform", keywords: ["terraform"] },
  { theme: "testing", keywords: ["testing"] },
  { theme: "timeManagement", keywords: ["time management"] },
  { theme: "typescript", keywords: ["typescript"] },
  { theme: "ui", keywords: ["user interface", "ui"] },
  { theme: "ux", keywords: ["user experience", "ux"] },
  { theme: "versionControl", keywords: ["version control"] },
  { theme: "video", keywords: ["video", "video editing"] },
  { theme: "virtualization", keywords: ["virtualization"] },
  { theme: "web", keywords: ["web", "web development"] },
  { theme: "webDesign", keywords: ["web design"] },
  { theme: "windows", keywords: ["windows"] },
  { theme: "nodeJS", keywords: ["nodejs"] },
  { theme: "postgresql", keywords: ["postgresql", "postgres"] },
  { theme: "python", keywords: ["python"] },
  { theme: "reactNative", keywords: ["react native"] },
  { theme: "redux", keywords: ["redux"] },
  { theme: "restAPI", keywords: ["rest api"] },
  { theme: "ruby", keywords: ["ruby"] },
  { theme: "rubyOnRails", keywords: ["ruby on rails"] },
  { theme: "salesforce", keywords: ["salesforce"] },
  { theme: "scala", keywords: ["scala"] },
  { theme: "security", keywords: ["security", "cybersecurity"] },
  { theme: "serverless", keywords: ["serverless"] },
  { theme: "softwareArchitecture", keywords: ["software architecture"] },
  { theme: "softwareDesign", keywords: ["software design"] },
  { theme: "sql", keywords: ["sql"] },
  { theme: "swift", keywords: ["swift"] },
  { theme: "teamwork", keywords: ["teamwork"] },
  { theme: "terraform", keywords: ["terraform"] },
  { theme: "typescript", keywords: ["typescript"] },
  { theme: "UI", keywords: ["ui design", "user interface"] },
  { theme: "UX", keywords: ["ux design", "user experience"] },
  { theme: "versionControl", keywords: ["version control"] },
  { theme: "vueJS", keywords: ["vuejs"] },
  { theme: "webDevelopment", keywords: ["web development"] },
  { theme: "wordpress", keywords: ["wordpress"] },
  { theme: "agileMethodology", keywords: ["agile methodology"] },
  { theme: "android", keywords: ["android"] },
  { theme: "apiDevelopment", keywords: ["api development"] },
  {
    theme: "artificialIntelligence",
    keywords: ["artificial intelligence", "ai"],
  },
  { theme: "azure", keywords: ["azure"] },
  { theme: "bootstrap", keywords: ["bootstrap"] },
  { theme: "c", keywords: ["c"] },
  { theme: "c#", keywords: ["c#"] },
  { theme: "c++", keywords: ["c++"] },
  { theme: "cloudComputing", keywords: ["cloud computing"] },
  { theme: "computerScience", keywords: ["computer science"] },
  { theme: "continuousIntegration", keywords: ["continuous integration"] },
  { theme: "css", keywords: ["css"] },
  { theme: "dataAnalysis", keywords: ["data analysis"] },
  { theme: "dataMining", keywords: ["data mining"] },
  { theme: "dataScience", keywords: ["data science"] },
  { theme: "dataVisualization", keywords: ["data visualization"] },
  { theme: "databaseDesign", keywords: ["database design"] },
  { theme: "devOps", keywords: ["devops"] },
  { theme: "docker", keywords: ["docker"] },
  { theme: "elixir", keywords: ["elixir"] },
  { theme: "embeddedSystems", keywords: ["embedded systems"] },
  { theme: "frontendDevelopment", keywords: ["frontend development"] },
  { theme: "fullStackDevelopment", keywords: ["full stack development"] },
  { theme: "gitHub", keywords: ["github"] },
  { theme: "gameDevelopment", keywords: ["game development"] },
  { theme: "gameEngine", keywords: ["game engine"] },
  { theme: "garbageCollection", keywords: ["garbage collection"] },
  { theme: "gatedCheckin", keywords: ["gated check-in"] },
  { theme: "gcp", keywords: ["gcp"] },
  { theme: "gemfire", keywords: ["gemfire"] },
  { theme: "gender", keywords: ["gender"] },
  { theme: "generalCounsel", keywords: ["general counsel"] },
  { theme: "geocoding", keywords: ["geocoding"] },
  { theme: "geofencing", keywords: ["geofencing"] },
  { theme: "geoip", keywords: ["geoip"] },
  { theme: "geolocation", keywords: ["geolocation"] },
  { theme: "geo-targeting", keywords: ["geo-targeting"] },
  { theme: "github", keywords: ["github"] },
  { theme: "gitlab", keywords: ["gitlab"] },
  { theme: "glacier", keywords: ["glacier"] },
  { theme: "glassfish", keywords: ["glassfish"] },
  { theme: "golang", keywords: ["golang"] },
  { theme: "googleAds", keywords: ["google ads"] },
  { theme: "googleAnalytics", keywords: ["google analytics"] },
  { theme: "googleAppEngine", keywords: ["google app engine"] },
  { theme: "googleCloudFunctions", keywords: ["google cloud functions"] },
  { theme: "googleCloudPlatform", keywords: ["google cloud platform"] },
  { theme: "googleDataflow", keywords: ["google dataflow"] },
  { theme: "googleMaps", keywords: ["google maps"] },
  { theme: "googleOptimize", keywords: ["google optimize"] },
  { theme: "googleSearchConsole", keywords: ["google search console"] },
  { theme: "googleSheets", keywords: ["google sheets"] },
  { theme: "googleTagManager", keywords: ["google tag manager"] },
  { theme: "governance", keywords: ["governance"] },
  { theme: "gpuProgramming", keywords: ["gpu programming"] },
  { theme: "gradle", keywords: ["gradle"] },
  { theme: "graphDatabase", keywords: ["graph database"] },
  { theme: "graphql", keywords: ["graphql"] },
  { theme: "gridsome", keywords: ["gridsome"] },
  { theme: "groovy", keywords: ["groovy"] },
  { theme: "grpc", keywords: ["grpc"] },
  { theme: "guaranteedDelivery", keywords: ["guaranteed delivery"] },
  { theme: "gui", keywords: ["gui"] },
  { theme: "gulp", keywords: ["gulp"] },
  { theme: "gunicorn", keywords: ["gunicorn"] },
  { theme: "hadoop", keywords: ["hadoop"] },
  { theme: "haproxy", keywords: ["haproxy"] },
  { theme: "hardware", keywords: ["hardware"] },
  { theme: "hardwareDesign", keywords: ["hardware design"] },
  { theme: "hardwareTesting", keywords: ["hardware testing"] },
  { theme: "harmony", keywords: ["harmony"] },
  { theme: "haskell", keywords: ["haskell"] },
  { theme: "hadoop", keywords: ["hadoop"] },
  { theme: "healthInsurance", keywords: ["health insurance"] },
  { theme: "healthcare", keywords: ["healthcare"] },
  { theme: "heroku", keywords: ["heroku"] },
  { theme: "html", keywords: ["html"] },
  { theme: "http", keywords: ["http"] },
  { theme: "hyperledger", keywords: ["hyperledger"] },
  { theme: "i18n", keywords: ["i18n", "internationalization"] },
  { theme: "identity", keywords: ["identity", "identity theft"] },
  { theme: "immutability", keywords: ["immutability"] },
  { theme: "incidentManagement", keywords: ["incident management"] },
  { theme: "informationSecurity", keywords: ["information security"] },
  { theme: "infrastructure", keywords: ["infrastructure"] },
  { theme: "integrationTesting", keywords: ["integration testing"] },
  { theme: "ios", keywords: ["ios"] },
  { theme: "iot", keywords: ["iot", "internet of things"] },
  { theme: "ipAddress", keywords: ["ip address"] },
  { theme: "iterativeDevelopment", keywords: ["iterative development"] },
  { theme: "javaScript", keywords: ["javascript", "js"] },
  { theme: "jenkins", keywords: ["jenkins"] },
  { theme: "jira", keywords: ["jira"] },
  { theme: "jmeter", keywords: ["jmeter"] },
  { theme: "junit", keywords: ["junit"] },
  { theme: "kanban", keywords: ["kanban"] },
  { theme: "kubernetes", keywords: ["kubernetes"] },
  { theme: "lambda", keywords: ["lambda"] },
  { theme: "laravel", keywords: ["laravel"] },
  { theme: "leadership", keywords: ["leadership"] },
  { theme: "linux", keywords: ["linux"] },
  { theme: "loadBalancing", keywords: ["load balancing"] },
  { theme: "logistics", keywords: ["logistics"] },
  { theme: "logstash", keywords: ["logstash"] },
  {
    theme: "machineLearning",
    keywords: ["machine learning", "ai", "artificial intelligence"],
  },
  { theme: "macOS", keywords: ["macos", "osx"] },
  { theme: "marketAnalysis", keywords: ["market analysis"] },
  { theme: "marketing", keywords: ["marketing"] },
  { theme: "maven", keywords: ["maven"] },
  { theme: "meanStack", keywords: ["mean stack"] },
  { theme: "microFrontends", keywords: ["micro frontends"] },
  {
    theme: "microservicesArchitecture",
    keywords: ["microservices architecture"],
  },
  { theme: "mobileDevelopment", keywords: ["mobile development"] },
  { theme: "mockTesting", keywords: ["mock testing"] },
  { theme: "mongodb", keywords: ["mongodb"] },
  { theme: "monitoring", keywords: ["monitoring"] },
  { theme: "mvc", keywords: ["mvc"] },
  { theme: "mysql", keywords: ["mysql"] },
  { theme: "nagios", keywords: ["nagios"] },
  {
    theme: "naturalLanguageProcessing",
    keywords: ["natural language processing", "nlp"],
  },
  {
    theme: "name",
    keywords: [
      "name",
      "full name",
      "first name",
      "last name",
      "signature",
      " i certify that answers given herein are true, accurate, and complete to the best of my knowledge.",
    ],
  },
  { theme: "native", keywords: ["native"] },
  { theme: "nav", keywords: ["nav", "navigation"] },
  { theme: "nearby", keywords: ["nearby", "near"] },
  { theme: "need", keywords: ["need"] },
  { theme: "net", keywords: ["net", "network"] },
  { theme: "networking", keywords: ["networking"] },
  { theme: "newRelic", keywords: ["new relic"] },
  { theme: "newsletter", keywords: ["newsletter", "newsletters"] },
  { theme: "next", keywords: ["next"] },
  { theme: "nifi", keywords: ["nifi"] },
  { theme: "node", keywords: ["node"] },
  { theme: "npm", keywords: ["npm"] },
  { theme: "nps", keywords: ["nps"] },
  { theme: "nuxt", keywords: ["nuxt"] },
  { theme: "oauth", keywords: ["oauth"] },
  { theme: "objectionjs", keywords: ["objectionjs"] },
  { theme: "ocelot", keywords: ["ocelot"] },
  { theme: "office", keywords: ["office", "microsoft office"] },
  { theme: "okta", keywords: ["okta"] },
  { theme: "omnifocus", keywords: ["omnifocus"] },
  { theme: "omniplan", keywords: ["omniplan"] },
  { theme: "omniture", keywords: ["omniture"] },
  { theme: "oneDrive", keywords: ["one drive"] },
  { theme: "onenote", keywords: ["onenote"] },
  { theme: "opengl", keywords: ["opengl"] },
  { theme: "openID", keywords: ["open id"] },
  { theme: "openShift", keywords: ["openshift"] },
  { theme: "openai", keywords: ["openai"] },
  { theme: "opendistro", keywords: ["opendistro"] },
  { theme: "openstack", keywords: ["openstack"] },
  { theme: "oracle", keywords: ["oracle"] },
  { theme: "orchardCore", keywords: ["orchard core"] },
  { theme: "orm", keywords: ["orm", "object relational mapping"] },
  { theme: "osquery", keywords: ["osquery"] },
  { theme: "osx", keywords: ["osx"] },
  { theme: "outlook", keywords: ["outlook"] },
  { theme: "overwolf", keywords: ["overwolf"] },
  { theme: "owasp", keywords: ["owasp"] },
  { theme: "pandas", keywords: ["pandas"] },
  { theme: "papertrail", keywords: ["papertrail"] },
  { theme: "parcel", keywords: ["parcel"] },
  { theme: "part", keywords: ["part"] },
  { theme: "passport", keywords: ["passport"] },
  { theme: "paypal", keywords: ["paypal"] },
  { theme: "performance", keywords: ["performance"] },
  { theme: "permissions", keywords: ["permissions"] },
  { theme: "php", keywords: ["php"] },
  { theme: "paidLeave", keywords: ["paid leave"] },
  { theme: "password", keywords: ["password", "password policy"] },
  {
    theme: "performance",
    keywords: ["performance evaluation", "performance review"],
  },
  {
    theme: "personalInfo",
    keywords: ["personal information", "personal data"],
  },
  { theme: "petPolicy", keywords: ["pet policy"] },
  { theme: "phone", keywords: ["phone number", "contact phone"] },
  { theme: "portfolio", keywords: ["portfolio"] },
  { theme: "position", keywords: ["position"] },
  { theme: "preferredLocation", keywords: ["preferred location"] },
  {
    theme: "pregnancy",
    keywords: ["pregnancy", "pregnant", "maternity leave"],
  },
  { theme: "privacy", keywords: ["privacy policy"] },
  { theme: "probation", keywords: ["probationary period"] },
  { theme: "productivity", keywords: ["productivity"] },
  { theme: "professionalReferences", keywords: ["professional references"] },
  { theme: "professionalism", keywords: ["professionalism"] },
  { theme: "programmingLanguages", keywords: ["programming languages"] },
  { theme: "projectManagement", keywords: ["project management"] },
  { theme: "promotions", keywords: ["promotions", "promotion opportunities"] },
  { theme: "property", keywords: ["property", "stolen property"] },
  { theme: "prospectiveEmployee", keywords: ["prospective employee"] },
  { theme: "publications", keywords: ["publications"] },
  { theme: "python", keywords: ["python"] },
  { theme: "qualifications", keywords: ["qualifications"] },
  { theme: "qualityAssurance", keywords: ["quality assurance", "qa testing"] },
  { theme: "racialHarassment", keywords: ["racial harassment"] },
  { theme: "reasonForLeaving", keywords: ["reason for leaving"] },
  { theme: "recruitment", keywords: ["recruitment process", "recruiting"] },
  { theme: "refusalToWork", keywords: ["refusal to work"] },
  { theme: "remoteWork", keywords: ["remote work", "telecommuting"] },
  { theme: "relocation", keywords: ["relocation"] },
  { theme: "reporting", keywords: ["reporting", "reporting structure"] },
  { theme: "requirements", keywords: ["requirements", "minimum requirements"] },
  { theme: "resignation", keywords: ["resignation", "two weeks notice"] },
  { theme: "retirementPlan", keywords: ["retirement plan", "401k"] },
  { theme: "role", keywords: ["role", "job role"] },
  { theme: "ruby", keywords: ["ruby"] },
  { theme: "sales", keywords: ["sales", "sales experience"] },
  { theme: "schedule", keywords: ["schedule", "work schedule"] },
  { theme: "schoolActivities", keywords: ["school activities"] },
  { theme: "security", keywords: ["security", "data security"] },
  { theme: "selfAssessment", keywords: ["self-assessment"] },
  { theme: "sexHarassment", keywords: ["sexual harassment"] },
  { theme: "shareholderMeeting", keywords: ["shareholder meeting"] },
  { theme: "skills", keywords: ["skills", "required skills"] },
  { theme: "salesforce", keywords: ["salesforce"] },
  { theme: "security", keywords: ["security", "information security"] },
  { theme: "seo", keywords: ["seo", "search engine optimization"] },
  { theme: "serverless", keywords: ["serverless"] },
  {
    theme: "softwareTesting",
    keywords: ["software testing", "automated testing", "manual testing"],
  },
  { theme: "sql", keywords: ["sql", "mysql", "postgresql"] },
  { theme: "startup", keywords: ["startup"] },
  { theme: "statistics", keywords: ["statistics", "statistical analysis"] },
  { theme: "swift", keywords: ["swift"] },
  { theme: "systemDesign", keywords: ["system design"] },
  { theme: "teamManagement", keywords: ["team management", "managing teams"] },
  { theme: "typescript", keywords: ["typescript"] },
  { theme: "ui", keywords: ["ui", "user interface"] },
  { theme: "ux", keywords: ["ux", "user experience"] },
  { theme: "vagrant", keywords: ["vagrant"] },
  { theme: "video", keywords: ["video"] },
  { theme: "virtualReality", keywords: ["virtual reality", "vr"] },
  { theme: "vuejs", keywords: ["vue.js", "vue"] },
  { theme: "webDevelopment", keywords: ["web development"] },
  { theme: "windows", keywords: ["windows"] },
  { theme: "wordpress", keywords: ["wordpress"] },
  { theme: "workflow", keywords: ["workflow"] },
  { theme: "writing", keywords: ["writing", "content writing"] },
  { theme: "xamarin", keywords: ["xamarin"] },
  { theme: "xml", keywords: ["xml"] },
  { theme: "yarn", keywords: ["yarn"] },
  { theme: "zend", keywords: ["zend"] },
  { theme: "zeroMQ", keywords: ["zeromq", "zmq"] },
  { theme: "zoom", keywords: ["zoom"] },
  { theme: "3dPrinting", keywords: ["3d printing"] },
  { theme: "3dRendering", keywords: ["3d rendering"] },
  { theme: "4G", keywords: ["4g"] },
  { theme: "5G", keywords: ["5g"] },
  { theme: "Accessibility", keywords: ["accessibility", "accessible design"] },
  { theme: "Adobe", keywords: ["adobe", "adobe creative suite"] },
  { theme: "AI", keywords: ["ai", "artificial intelligence"] },
  { theme: "Algorithms", keywords: ["algorithms", "algorithm design"] },
  { theme: "AmazonEC2", keywords: ["amazon ec2", "ec2"] },
  { theme: "AmazonS3", keywords: ["amazon s3", "s3"] },
  { theme: "Android", keywords: ["android"] },
  { theme: "Angular", keywords: ["angular"] },
  { theme: "Ansible", keywords: ["ansible"] },
  { theme: "API", keywords: ["api", "rest api"] },
  { theme: "Arduino", keywords: ["arduino"] },
  { theme: "ASP.NET", keywords: ["asp.net"] },
  { theme: "AugmentedReality", keywords: ["augmented reality", "ar"] },
  { theme: "agile", keywords: ["agile", "scrum", "kanban"] },
  { theme: "algorithms", keywords: ["algorithms", "data structures"] },
  { theme: "api", keywords: ["api", "rest", "graphql"] },
  {
    theme: "architecture",
    keywords: [
      "software architecture",
      "microservices",
      "service-oriented architecture",
    ],
  },
  { theme: "aws", keywords: ["aws", "amazon web services"] },
  { theme: "azure", keywords: ["azure", "microsoft azure"] },
  {
    theme: "backend",
    keywords: ["backend development", "server-side programming"],
  },
  { theme: "bigData", keywords: ["big data", "hadoop", "spark"] },
  { theme: "c++", keywords: ["c++", "cpp"] },
  { theme: "cloud", keywords: ["cloud computing", "cloud-native"] },
  { theme: "coding", keywords: ["coding", "programming"] },
  { theme: "collaboration", keywords: ["collaboration", "teamwork"] },
  {
    theme: "communication",
    keywords: ["communication", "listening", "verbal communication"],
  },
  {
    theme: "computerScience",
    keywords: ["computer science", "computational thinking"],
  },
  {
    theme: "containers",
    keywords: ["docker", "kubernetes", "containerization"],
  },
  { theme: "css", keywords: ["css", "cascading style sheets"] },
  {
    theme: "dataAnalysis",
    keywords: ["data analysis", "data visualization", "pandas"],
  },
  {
    theme: "dataScience",
    keywords: ["data science", "machine learning", "deep learning"],
  },
  { theme: "database", keywords: ["database", "sql", "nosql"] },
  { theme: "debugging", keywords: ["debugging", "troubleshooting"] },
  {
    theme: "devOps",
    keywords: ["devops", "continuous integration", "continuous delivery"],
  },
  { theme: "django", keywords: ["django", "python web framework"] },
  { theme: "docker", keywords: ["docker", "containerization"] },
  {
    theme: "frontend",
    keywords: ["frontend development", "client-side programming"],
  },
  {
    theme: "fullStack",
    keywords: ["full stack development", "web development"],
  },
  { theme: "git", keywords: ["git", "version control"] },
  { theme: "html", keywords: ["html", "hypertext markup language"] },
  { theme: "javascript", keywords: ["javascript", "ecmascript"] },
  { theme: "java", keywords: ["java", "java programming"] },
  { theme: "jenkins", keywords: ["jenkins", "continuous integration"] },
  { theme: "jquery", keywords: ["jquery", "javascript library"] },
  { theme: "json", keywords: ["json", "javascript object notation"] },
  { theme: "kotlin", keywords: ["kotlin", "jvm programming language"] },
  { theme: "leadership", keywords: ["leadership", "management", "mentorship"] },
  { theme: "linux", keywords: ["linux", "unix", "operating system"] },
  {
    theme: "machineLearning",
    keywords: ["machine learning", "artificial intelligence"],
  },
  { theme: "mongodb", keywords: ["mongodb", "document-oriented database"] },
  { theme: "Agile development", keywords: ["agile development", "scrum"] },
  {
    theme: "Algorithm design",
    keywords: ["algorithm design", "data structures"],
  },
  { theme: "AWS", keywords: ["aws", "amazon web services"] },
  { theme: "Backend development", keywords: ["backend development"] },
  { theme: "Big data", keywords: ["big data", "hadoop"] },
  { theme: "Blockchain", keywords: ["blockchain", "smart contracts"] },
  {
    theme: "CI/CD",
    keywords: ["continuous integration", "continuous deployment", "ci/cd"],
  },
  {
    theme: "Cloud computing",
    keywords: ["cloud computing", "cloud architecture"],
  },
  { theme: "Code review", keywords: ["code review"] },
  { theme: "Communication skills", keywords: ["communication skills"] },
  { theme: "Computer graphics", keywords: ["computer graphics"] },
  {
    theme: "Computer networks",
    keywords: ["computer networks", "network protocols"],
  },
  { theme: "Concurrency", keywords: ["concurrency", "multithreading"] },
  { theme: "CSS", keywords: ["css", "cascading style sheets"] },
  { theme: "Data analysis", keywords: ["data analysis", "data visualization"] },
  {
    theme: "Database design",
    keywords: ["database design", "database management"],
  },
  { theme: "Debugging", keywords: ["debugging", "troubleshooting"] },
  {
    theme: "Design patterns",
    keywords: ["design patterns", "object-oriented design"],
  },
  { theme: "DevOps", keywords: ["devops", "site reliability engineering"] },
  {
    theme: "Distributed systems",
    keywords: ["distributed systems", "distributed computing"],
  },
  { theme: "Django", keywords: ["django", "python web framework"] },
  { theme: "Documentation", keywords: ["documentation", "technical writing"] },
  { theme: "Docker", keywords: ["docker", "containerization"] },
  { theme: "Encryption", keywords: ["encryption", "cryptography"] },
  {
    theme: "Frontend development",
    keywords: ["frontend development", "javascript frameworks"],
  },
  { theme: "Functional programming", keywords: ["functional programming"] },
  { theme: "Git", keywords: ["git", "version control"] },
  { theme: "GraphQL", keywords: ["graphql", "api design"] },
  { theme: "Hadoop", keywords: ["hadoop", "big data"] },
  { theme: "HTTP", keywords: ["http", "restful api"] },
  { theme: "iOS development", keywords: ["ios development", "swift"] },
  { theme: "Java", keywords: ["java", "java virtual machine"] },
  { theme: "JavaScript", keywords: ["javascript", "ecmascript"] },
  { theme: "jQuery", keywords: ["jquery", "javascript library"] },
  { theme: "Kafka", keywords: ["kafka", "distributed messaging"] },
  { theme: "Linux", keywords: ["linux", "unix"] },
  {
    theme: "Machine learning",
    keywords: ["machine learning", "artificial intelligence"],
  },
  {
    theme: "Microservices",
    keywords: ["microservices", "service-oriented architecture"],
  },
  {
    theme: "Mobile development",
    keywords: ["mobile development", "react native"],
  },
  { theme: "MongoDB", keywords: ["mongodb", "nosql"] },
  {
    theme: "React",
    keywords: ["React", "React.js", "ReactJS", "React Native", "ReactNative"],
  },
  { theme: "Vue.js", keywords: ["Vue", "Vue.js", "VueJS"] },
  {
    theme: "Angular",
    keywords: [
      "Angular",
      "Angular.js",
      "AngularJS",
      "Angular 2",
      "Angular 4",
      "Angular 6",
      "Angular 8",
      "Angular 10",
    ],
  },
  {
    theme: "JavaScript",
    keywords: [
      "JavaScript",
      "ES6",
      "ES2015",
      "ES2016",
      "ES2017",
      "ES2018",
      "ES2019",
      "ES2020",
    ],
  },
  { theme: "HTML", keywords: ["HTML", "HTML5", "Markup"] },
  {
    theme: "CSS",
    keywords: [
      "CSS",
      "CSS3",
      "Sass",
      "Less",
      "Bootstrap",
      "Tailwind",
      "Styled Components",
    ],
  },
  {
    theme: "Responsive Design",
    keywords: [
      "Responsive Design",
      "Responsive Web Design",
      "Mobile-first Design",
    ],
  },
  { theme: "Webpack", keywords: ["Webpack", "Webpack 4", "Webpack 5"] },
  { theme: "Babel", keywords: ["Babel", "Babel 7", "Babel 8"] },
  { theme: "TypeScript", keywords: ["TypeScript"] },
  {
    theme: "Redux",
    keywords: ["Redux", "React-Redux", "Redux Saga", "Redux Thunk"],
  },
  { theme: "GraphQL", keywords: ["GraphQL"] },
  { theme: "REST API", keywords: ["REST API", "RESTful API"] },
  {
    theme: "Responsive Images",
    keywords: [
      "Responsive Images",
      "Responsive Images in HTML",
      "Responsive Images in CSS",
    ],
  },
  {
    theme: "Progressive Web Apps",
    keywords: ["Progressive Web Apps", "PWA", "Service Workers"],
  },
  {
    theme: "Accessibility",
    keywords: [
      "Accessibility",
      "WCAG",
      "ARIA",
      "Screen Readers",
      "Keyboard Navigation",
    ],
  },
  {
    theme: "Cross-Browser Compatibility",
    keywords: ["Cross-Browser Compatibility", "Browser Compatibility"],
  },
  {
    theme: "Performance Optimization",
    keywords: ["Performance Optimization", "Web Performance", "Page Speed"],
  },
  {
    theme: "Unit Testing",
    keywords: ["Unit Testing", "Jest", "Mocha", "Chai"],
  },
  {
    theme: "Integration Testing",
    keywords: ["Integration Testing", "Cypress", "Selenium"],
  },
  {
    theme: "End-to-End Testing",
    keywords: ["End-to-End Testing", "E2E Testing", "TestCafe", "Nightwatch"],
  },
  {
    theme: "Debugging",
    keywords: ["Debugging", "Chrome DevTools", "Firefox DevTools"],
  },
  { theme: "Git", keywords: ["Git", "Version Control"] },
  { theme: "Agile", keywords: ["Agile", "Scrum", "Kanban"] },
  { theme: "Pair Programming", keywords: ["Pair Programming"] },
  { theme: "Code Review", keywords: ["Code Review"] },
  {
    theme: "Continuous Integration",
    keywords: ["Continuous Integration", "CI/CD"],
  },
  {
    theme: "MVC Architecture",
    keywords: ["MVC", "MVC Architecture", "Model View Controller"],
  },
  {
    theme: "MVVM Architecture",
    keywords: ["MVVM", "MVVM Architecture", "Model View ViewModel"],
  },
  { theme: "node.js", keywords: ["node.js", "nodejs"] },
  { theme: "MongoDB", keywords: ["mongodb"] },
  { theme: "PostgreSQL", keywords: ["postgresql", "postgres"] },
  { theme: "Java", keywords: ["java", "j2ee"] },
  { theme: "RESTful API", keywords: ["rest", "restful api"] },
  { theme: "AWS Lambda", keywords: ["aws lambda"] },
  { theme: "AWS S3", keywords: ["aws s3"] },
  { theme: "AWS EC2", keywords: ["aws ec2"] },
  { theme: "AWS ECS", keywords: ["aws ecs"] },
  { theme: "AWS RDS", keywords: ["aws rds"] },
  { theme: "AWS SQS", keywords: ["aws sqs"] },
  { theme: "AWS Kinesis", keywords: ["aws kinesis"] },
  { theme: "AWS Aurora", keywords: ["aws aurora"] },
  { theme: "AWS DynamoDB", keywords: ["aws dynamodb"] },
  { theme: "Python", keywords: ["python"] },
  { theme: "Ruby on Rails", keywords: ["ruby on rails"] },
  { theme: "Flask", keywords: ["flask"] },
  { theme: "Django", keywords: ["django"] },
  { theme: "PHP", keywords: ["php"] },
  { theme: "Laravel", keywords: ["laravel"] },
  { theme: "Symfony", keywords: ["symfony"] },
  { theme: "C#", keywords: ["c#", ".net"] },
  { theme: "ASP.NET", keywords: ["asp.net", "aspnet"] },
  { theme: "C++", keywords: ["c++"] },
  { theme: "Go", keywords: ["go", "golang"] },
  { theme: "Scala", keywords: ["scala"] },
  { theme: "Kafka", keywords: ["kafka"] },
  { theme: "RabbitMQ", keywords: ["rabbitmq"] },
  { theme: "SQLAlchemy", keywords: ["sqlalchemy"] },
  { theme: "Express.js", keywords: ["express.js"] },
  { theme: "Docker", keywords: ["docker"] },
  { theme: "Kubernetes", keywords: ["kubernetes"] },
  { theme: "Redis", keywords: ["redis"] },
  { theme: "Elasticsearch", keywords: ["elasticsearch"] },
  { theme: "Nginx", keywords: ["nginx"] },
  { theme: "Apache", keywords: ["apache"] },
  { theme: "Linux", keywords: ["linux"] },
  { theme: "Git", keywords: ["git"] },
  { theme: "REST API Design", keywords: ["rest api design"] },
  { theme: "SOAP", keywords: ["soap"] },
  { theme: "OAuth", keywords: ["oauth"] },
  { theme: "JWT", keywords: ["jwt"] },
  {
    theme: "CI/CD",
    keywords: ["ci/cd", "continuous integration", "continuous deployment"],
  },
  {
    theme: "Unit Testing",
    keywords: ["unit testing", "test-driven development", "tdd"],
  },
  { theme: "Integration Testing", keywords: ["integration testing"] },
  { theme: "Load Testing", keywords: ["load testing", "performance testing"] },
  { theme: "Agile Methodology", keywords: ["agile methodology"] },
  {
    theme: "C programming",
    keywords: [
      "embedded C programming",
      "microcontroller programming",
      "firmware development",
    ],
  },
  {
    theme: "Assembly language",
    keywords: [
      "assembly programming",
      "assembly language development",
      "low-level programming",
    ],
  },
  {
    theme: "RTOS",
    keywords: ["real-time operating system", "RTOS kernel", "RTOS scheduling"],
  },
  {
    theme: "Embedded systems",
    keywords: [
      "embedded systems development",
      "embedded hardware design",
      "embedded software design",
    ],
  },
  {
    theme: "Device drivers",
    keywords: [
      "device driver development",
      "device driver programming",
      "driver interface",
    ],
  },
  {
    theme: "Interrupts",
    keywords: [
      "interrupt handling",
      "interrupt service routines",
      "hardware interrupts",
    ],
  },
  {
    theme: "ARM Cortex-M",
    keywords: [
      "ARM Cortex-M programming",
      "ARM Cortex-M microcontrollers",
      "ARM CMSIS",
    ],
  },
  {
    theme: "Debugging",
    keywords: [
      "embedded debugging",
      "low-level debugging",
      "debugging hardware",
    ],
  },
  {
    theme: "Bare-metal programming",
    keywords: [
      "bare-metal programming",
      "bare-metal development",
      "bare-metal firmware",
    ],
  },
  { theme: "SPI", keywords: ["SPI protocol", "SPI bus", "SPI communication"] },
  { theme: "I2C", keywords: ["I2C protocol", "I2C bus", "I2C communication"] },
  {
    theme: "UART",
    keywords: ["UART protocol", "UART communication", "UART interface"],
  },
  { theme: "CAN", keywords: ["CAN protocol", "CAN bus", "CAN communication"] },
  {
    theme: "Wireless communication",
    keywords: [
      "wireless communication protocols",
      "RF communication",
      "Bluetooth programming",
    ],
  },
  {
    theme: "Low-power design",
    keywords: [
      "low-power embedded systems",
      "low-power hardware design",
      "power optimization",
    ],
  },
  { theme: "FPGA", keywords: ["FPGA development", "FPGA programming", "VHDL"] },
  {
    theme: "ASIC design",
    keywords: ["ASIC development", "ASIC programming", "ASIC verification"],
  },
  {
    theme: "Signal processing",
    keywords: [
      "embedded signal processing",
      "DSP programming",
      "filter design",
    ],
  },
  {
    theme: "Sensor integration",
    keywords: ["sensor interfacing", "sensor fusion", "sensor calibration"],
  },
  {
    theme: "Control systems",
    keywords: [
      "embedded control systems",
      "feedback control",
      "PID controllers",
    ],
  },
  {
    theme: "Real-time simulations",
    keywords: [
      "real-time simulation development",
      "hardware-in-the-loop testing",
      "closed-loop control systems",
    ],
  },
  {
    theme: "Hardware design",
    keywords: ["hardware development", "digital design", "analog design"],
  },
  {
    theme: "VLSI design",
    keywords: ["VLSI development", "VLSI programming", "ASIC design flow"],
  },
  {
    theme: "PCB design",
    keywords: ["PCB layout", "PCB design software", "high-speed PCB design"],
  },
  {
    theme: "Power electronics",
    keywords: [
      "power electronics design",
      "power converter design",
      "power management ICs",
    ],
  },
  {
    theme: "EMC compliance",
    keywords: ["EMC testing", "EMC standards", "EMC design considerations"],
  },
  {
    theme: "Circuit analysis",
    keywords: ["circuit analysis", "circuit design", "analog circuitry"],
  },
  {
    theme: "Simulation software",
    keywords: [
      "simulation software development",
      "SPICE simulation",
      "EDA tools",
    ],
  },
];
// merges themes and keywords to reduce duplicates
const combineKeywords = (themes) => {
  const combinedThemes = [];
  for (const theme of themes) {
    let combined = false;
    for (const combinedTheme of combinedThemes) {
      if (combinedTheme.keywords.includes(theme.theme)) {
        combinedTheme.keywords.push(
          ...theme.keywords.filter(
            (keyword) => !combinedTheme.keywords.includes(keyword)
          )
        );
        combined = true;
        break;
      } else if (theme.keywords.includes(combinedTheme.theme)) {
        theme.keywords.push(
          ...combinedTheme.keywords.filter(
            (keyword) => !theme.keywords.includes(keyword)
          )
        );
        combinedTheme.theme = theme.theme;
        combinedTheme.keywords = theme.keywords;
        combined = true;
        break;
      }
    }
    if (!combined) {
      combinedThemes.push(theme);
    }
  }
  return combinedThemes;
};
// returns a keyword map of themes and associated keywords.
const getKeywordMap = (themes) => {
  const keywordMap = new Map();

  themes.forEach(({ theme, keywords }) => {
    for (const keyword of keywords) {
      keywordMap.set(keyword, theme);
    }
  });

  return keywordMap;
};

class PrivateSingleton {
  themes;
  keywordMap;

  constructor() {
    this.themes = combineKeywords(themesBeforeDeDupe);
    this.keywordMap = getKeywordMap(this.themes);
  }
}

class ThemeSingleton {
  themeSingleton = null;

  constructor() {
    throw new Error("You must use ThemeSingleton.getThemes()");
  }

  static getThemes() {
    if (!this.themeSingleton) {
      this.themeSingleton = new PrivateSingleton();
    }

    return this.themeSingleton.themes;
  }

  static getKeywordMap() {
    if (!this.themeSingleton) {
      this.themeSingleton = new PrivateSingleton();
    }

    return this.themeSingleton.keywordMap;
  }
}

// The Theme which is returned will be used as the intent of the question ex
// question.git
// TODO: this needs to be semantic similiarity. or it wont work!!
const extractThemeFromQuestion = (question) => {
  const keywordMap = ThemeSingleton.getKeywordMap();
  const lowerCaseQuestion = question.toLowerCase();

  for (const [keyword, theme] of keywordMap) {
    const k = keyword.toLowerCase();

    if (
      (k.length >= 3 && lowerCaseQuestion.includes(k)) ||
      lowerCaseQuestion.includes(` ${k} `)
    ) {
      return theme.toLowerCase();
    }
  }

  return null;
};

// returns the closest match if no answers are found for a question.
const closestMatch = (answers, options) => {
  let bestMatch = null;
  let maxMatches = -1;

  answers.forEach((answer) => {
    const inputWords = answer.answer
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, " ")
      .split(" ");

    options.forEach((option) => {
      const labelWords = option.label
        .toLowerCase()
        .replace(/[^0-9a-z]/gi, " ")
        .split(" ");
      let matches = 0;

      for (let i = 0; i < inputWords.length; i++) {
        if (labelWords.includes(inputWords[i])) {
          matches++;
        }
      }

      // check for exact number matches
      const answerNum = Number(answer.answer.replace(/[^0-9]/g, ""));
      const labelNum = Number(option.label.replace(/[^0-9]/g, ""));
      if (!isNaN(answerNum) && !isNaN(labelNum) && answerNum === labelNum) {
        matches++;
      }

      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = option.label;
      }
    });
  });

  return bestMatch;
};

// this is a helper function for categorizeQuestions
const processQuestionsArray = async (questionsArray, corpus) => {
  if (!corpus) {
    //TODO: should return error
    return;
  }

  // Remove any objects from the array that do not have the "required" property with a value of true
  const requiredQuestions = questionsArray.filter(
    (obj) => obj.required === "true"
  );

  // Train the NLP model with the provided corpus
  // TODO: reuse trained model by storing locally.
  const dock = await dockStart({ use: ["Basic"] });
  const nlp = dock.get("nlp");
  await nlp.addCorpus(corpus);
  await nlp.train();

  // Process each required question and obtain the appropriate answer
  const result = await Promise.all(
    requiredQuestions.map(async (questionObj) => {
      const { type, question, options = [] } = questionObj ?? {};
      const questionAnswer = await nlp.process(question);
      let answer = null;

      if (type === "text") {
        answer = questionAnswer.answer;
      } else if (type === "select") {
        answer = closestMatch(questionAnswer.answers, options);
      }

      return { question, answer };
    })
  );

  return result;
};

const buildExp = (item) => {
  return `How many years of experience do you have with ${item}`;
};

//builds experience based answers in years
// TODO: this should be redone later to be more dynamic.
const buildExpYears = (yearsOfExp) => {
  if (yearsOfExp <= 0) {
    return;
  }

  return [
    `${yearsOfExp}`,
    `${yearsOfExp} years`,
    `${yearsOfExp - 1}-${yearsOfExp + 1} years`,
    `${yearsOfExp}-${yearsOfExp + 1} years`,
    `${yearsOfExp - 1} to ${yearsOfExp} years`,
    `${yearsOfExp} to ${yearsOfExp + 1} years`,
  ];
};

// TODO: this function should be applied on the getUser endpoint and
// used to transform the response. This method may need to be memoized.
function mergeQualifications(qualifications, corpus) {
  for (const [skillName, skillLevel] of qualifications) {
    const intentName = `question.${skillName}`;
    // if (processedIntents.has(intentName)) {
    //   continue;
    // }

    const existingIntent = corpus.data.find((obj) => obj.intent === intentName);
    const utterance = buildExp(skillName);
    const answers = buildExpYears(skillLevel);

    if (existingIntent) {
      existingIntent.answers = [
        ...new Set([...existingIntent.answers, ...answers]),
      ];
      existingIntent.utterances = [
        ...new Set([...existingIntent.utterances, utterance]),
      ];
      return existingIntent;
    } else {
      const newIntent = {
        intent: intentName,
        utterances: [utterance],
        answers: [answers],
      };

      corpus.data.push(newIntent);
      return newIntent;
    }
  }
}

const mergeObjects = (arr1, objToMerge) => {
  const mergedArray = [...arr1];
  const arr2 = Object.values(objToMerge);

  // Loop through objects in arr2
  for (let i = 0; i < arr2.length; i++) {
    const obj2 = arr2[i];
    let mergedObj = null;

    // Check if obj2's intent matches an object in mergedArray
    for (let j = 0; j < mergedArray.length; j++) {
      const obj1 = mergedArray[j];

      if (obj1.intent === obj2.intent) {
        mergedObj = obj1;
        break;
      }
    }

    // If no matching intent was found, add obj2 to mergedArray
    if (!mergedObj) {
      mergedArray.push(obj2);
      continue;
    }

    // Merge obj2's utterances with obj1's utterances, removing duplicates
    const mergedUtterances = [...mergedObj.utterances];
    for (let k = 0; k < obj2.utterances.length; k++) {
      const utterance2 = obj2.utterances[k];
      let isDuplicate = false;

      // Check if utterance2 is a duplicate of any utterance in mergedUtterances
      for (let l = 0; l < mergedUtterances.length; l++) {
        const utterance1 = mergedUtterances[l];

        if (utterance1 === utterance2) {
          isDuplicate = true;
          break;
        }

        //TODO: figure out a better way to compare similiarity

        //   // Calculate the similarity between the two utterances
        //   const similarity = Similarity(utterance1, utterance2);

        //   // If the similarity is above the threshold, consider the utterances to be duplicates
        //   if (similarity >= 0.8) {
        //     isDuplicate = true;
        //     break;
        //   }
      }

      // If utterance2 is not a duplicate, add it to mergedUtterances
      if (!isDuplicate) {
        mergedUtterances.push(utterance2);
      }
    }

    // Update mergedObj's utterances to the mergedUtterances array
    mergedObj.utterances = mergedUtterances;
  }

  return mergedArray;
};

/**********************
 * GET JOB LINK *
 *
 *
 **********************/
// router.post('/answers', async (req, res) => {
//     // Add your code here
//     const {currentUser, body: {questions=[]} }= req ?? {};
//     let result;

//     if(currentUser && questions.length > 0){
//       console.log('inside cond');
//       result = await processQuestionsArray(questions, personalCorpus);
// TODO: processQuestionsArray should be moved to chrome extension
//     }

//     res.json({success: 'post call succeed!', response: result})
// });

const testQuestions = [
  {
    id: "286052",
    type: "select",
    question: "<br/>Are you legally authorized to work in the United States",
    required: "true",
    options: [
      {
        value: "1080238",
        label: "Yes",
      },
      {
        value: "1080239",
        label: "No",
      },
    ],
  },
  {
    id: "286048",
    type: "select",
    question: "How many years of Software Engineering experience do you have?",
    required: "true",
    options: [
      {
        value: "1080225",
        label: "Less than 1 year",
      },
      {
        value: "1080226",
        label: "1 to 2 years",
      },
      {
        value: "1080227",
        label: "2 to 4 years",
      },
      {
        value: "1080228",
        label: "4 to 6 years",
      },
      {
        value: "1082524",
        label: "I have no experience",
      },
      {
        value: "1082525",
        label: "6 to 8 years",
      },
      {
        value: "1082526",
        label: "8+ years",
      },
    ],
  },
  {
    id: "286050",
    type: "select",
    question: "How many years of work experience do you have using Java?",
    required: "true",
    options: [
      {
        value: "1080233",
        label: "Less than 1 year",
      },
      {
        value: "1080234",
        label: "1 to 2 years",
      },
      {
        value: "1080235",
        label: "2 to 4 years",
      },
      {
        value: "1082509",
        label: "4 to 6 years",
      },
      {
        value: "1082510",
        label: "6 to 8 years",
      },
      {
        value: "1082513",
        label: "I have never used Java",
      },
      {
        value: "1082545",
        label: "8+",
      },
    ],
  },
  {
    id: "353523",
    type: "select",
    question: "How many years of experience do you have using Spring Boot?",
    required: "true",
    options: [
      {
        value: "1254935",
        label: "Less than 1 year",
      },
      {
        value: "1254936",
        label: "1-3 years",
      },
      {
        value: "1254937",
        label: "4-6 years",
      },
      {
        value: "1254938",
        label: "More than 6 years",
      },
      {
        value: "1604984",
        label: "I have no experience",
      },
    ],
  },
  {
    id: "286067",
    type: "select",
    question: "How many years of work experience do you have using React?",
    required: "true",
    options: [
      {
        value: "1080284",
        label: "I have never used React",
      },
      {
        value: "1080285",
        label: "1 to 2 years",
      },
      {
        value: "1080286",
        label: "2 to 4 years",
      },
      {
        value: "1080287",
        label: "4 to 6 years",
      },
      {
        value: "1082511",
        label: "Less than 1 year",
      },
      {
        value: "1082512",
        label: "9+ years",
      },
      {
        value: "1082551",
        label: "6 to 8 years",
      },
    ],
  },
  {
    id: "286049",
    type: "select",
    question: "How many years of experience do you have using AWS?",
    required: "true",
    options: [
      {
        value: "1080229",
        label: "Less than 1 year",
      },
      {
        value: "1080230",
        label: "1 to 2 years",
      },
      {
        value: "1080231",
        label: "2 to 3 years",
      },
      {
        value: "1080232",
        label: "5 to 7 years",
      },
      {
        value: "1082537",
        label: "I have no experience",
      },
      {
        value: "1082538",
        label: "3 to 5 years",
      },
      {
        value: "1082539",
        label: "7+ years",
      },
    ],
  },
  {
    id: "503918",
    type: "text",
    question:
      "How many years experience do you have with Git, Containerization, or Microservices Architectures",
    required: "true",
  },
  {
    id: "286051",
    type: "select",
    question: "Are you eligible for DOD security clearance?",
    required: "true",
    options: [
      {
        value: "1080236",
        label: "Yes",
      },
      {
        value: "1080237",
        label: "Yes - Currently hold a clearance",
      },
      {
        value: "1083232",
        label: "No",
      },
    ],
  },
  {
    id: "286808",
    type: "select",
    question:
      "If required, will you be able to obtain a Department of Defense Security Clearance which includes but is not limited to US Citizenship, background investigation, etc.?",
    required: "true",
    options: [
      {
        value: "1082329",
        label: "Yes",
      },
      {
        value: "1082330",
        label: "No",
      },
    ],
  },
  {
    id: "286053",
    type: "select",
    question:
      "Please confirm your total compensation expectations for this position.",
    required: "true",
    options: [
      {
        value: "1080240",
        label: "Below $50,000",
      },
      {
        value: "1080241",
        label: "$50,000 to $60,000",
      },
      {
        value: "1080242",
        label: "$60,000 to $70,000",
      },
      {
        value: "1080243",
        label: "$70,000 to $80,000",
      },
      {
        value: "1080244",
        label: "$110,000 to $120,000",
      },
      {
        value: "1080245",
        label: "$120,000 to $130,000",
      },
      {
        value: "1080246",
        label: "$130,000 to $140,000",
      },
      {
        value: "1080247",
        label: "$140,000 to $150,000",
      },
      {
        value: "1080288",
        label: "More than $200,000",
      },
      {
        value: "1242890",
        label: "$80,000 to $90,000",
      },
      {
        value: "1242891",
        label: "$90,000 to $100,000",
      },
      {
        value: "1242892",
        label: "$100,000 to $110,000",
      },
      {
        value: "1242893",
        label: "$150,000 to $160,000",
      },
      {
        value: "1242894",
        label: "$160,000 to $170,000",
      },
      {
        value: "1242895",
        label: "$170,000 to $180,000",
      },
      {
        value: "1242896",
        label: "$180,000 to $190,000",
      },
      {
        value: "1242897",
        label: "$190,000 to $200,000",
      },
    ],
  },
  {
    id: "286810",
    type: "select",
    question: "Are you willing to undergo a pre-employment background check?",
    required: "true",
    options: [
      {
        value: "1082333",
        label: "Yes",
      },
      {
        value: "1082334",
        label: "No",
      },
    ],
  },
];

/****************************
 * UPDATE *
 ****************************/

/****************************
 * DELETE *
 ****************************/

module.exports = router;
