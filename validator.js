'use strict';

const objectHasKey = require('./src/validation/object-has-key');
const arrayContain = require('./src/validation/array-contain');
const arrayLength = require('./src/validation/array-length');
const stringLength = require('./src/validation/string-length');
const compare = require('./src/validation/compare');
const composite = require('./src/validation/composite');
const email = require('./src/validation/email');
const isEmpty = require('./src/validation/is-empty');
const isNotEmpty = require('./src/validation/is-not-empty');
const isNull = require('./src/validation/is-null');
const isNotNull = require('./src/validation/is-not-null');
const isUndefined = require('./src/validation/is-undefined');
const isNotUndefined = require('./src/validation/is-not-undefined');
const isFalse = require('./src/validation/is-false');
const isTrue = require('./src/validation/is-true');
const isType = require('./src/validation/is-type');
const regexp = require('./src/validation/regexp');

module.exports = {
    objectHasKey,
    arrayContain,
    arrayLength,
    stringLength,
    compare,
    composite,
    email,
    isEmpty,
    isNotEmpty,
    isNull,
    isNotNull,
    isUndefined,
    isNotUndefined,
    isFalse,
    isTrue,
    isType,
    regexp,
};
