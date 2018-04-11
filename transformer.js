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

module.exports.jsonDecode = jsonDecode;
module.exports.jsonEncode = jsonEncode;
module.exports.letterCase = letterCase;
module.exports.mapper = mapper;
module.exports.stringReplace = stringReplace;
module.exports.stringLimit = stringLimit;
module.exports.toType = toType;
module.exports.trim = trim;
module.exports.composite = composite;
