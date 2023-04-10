const core = require('@nlpjs/core');
const nlp = require('@nlpjs/nlp');
const basic = require('@nlpjs/basic');
const langenmin = require('@nlpjs/lang-en-min');
const requestrn = require('@nlpjs/request-rn');

const nlpjs = Object.assign({}, core, nlp, langenmin, requestrn, basic);

module.exports = nlpjs;
