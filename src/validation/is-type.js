'use strict';

var toType = function (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
};

var check = function (expected, value) {
    return expected === toType(value);
};

module.exports = function (expected) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(expected, value))
        });
    }
};

module.exports.TYPE_UNDEFINED = 'undefined';
module.exports.TYPE_NULL = 'null';
module.exports.TYPE_BOOLEAN = 'boolean';
module.exports.TYPE_NUMBER = 'number';
module.exports.TYPE_STRING = 'string';
module.exports.TYPE_ARRAY = 'array';
module.exports.TYPE_OBJECT = 'object';
module.exports.TYPE_FUNCTION = 'function';
module.exports.TYPE_DATE = 'date';
module.exports.TYPE_REGEXP = 'regexp';
