'use strict';

const jsonDecode = require('./src/transformer/json-decode');
const jsonEncode = require('./src/transformer/json-encode');
const letterCase = require('./src/transformer/letter-case');
const mapper = require('./src/transformer/mapper');
const stringReplace = require('./src/transformer/string-replace');
const stringLimit = require('./src/transformer/string-limit');
const toType = require('./src/transformer/to-type');
const trim = require('./src/transformer/trim');
const composite = require('./src/transformer/composite');

module.exports = {
    jsonDecode,
    jsonEncode,
    letterCase,
    mapper,
    stringReplace,
    stringLimit,
    toType,
    trim,
    composite,
};
