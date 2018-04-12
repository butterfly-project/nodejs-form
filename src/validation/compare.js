'use strict';

const _ = require('lodash');

const compare = function (operator, expected, value) {
    switch (operator) {
        case module.exports.EQUAL:
            return value == expected;
        case module.exports.NOT_EQUAL:
        case module.exports.NOT_EQUAL_ALTERNATIVE:
            return value != expected;
        case module.exports.IDENTICALLY:
            return value === expected;
        case module.exports.NOT_IDENTICALLY:
            return value !== expected;
        case module.exports.LESS:
            return value < expected;
        case module.exports.GREATER:
            return value > expected;
        case module.exports.LESS_OR_EQUAL:
            return value <= expected;
        case module.exports.GREATER_OR_EQUAL:
            return value >= expected;
        default:
            throw Error('Undefined operator ' + operator);
    }
};

module.exports = function (expected, operator) {
    operator = operator || module.exports.IDENTICALLY;

    return function (value) {
        return new Promise(function (resolve) {
            resolve(compare(operator, expected, value));
        });
    }
};

module.exports.EQUAL = '==';
module.exports.IDENTICALLY = '===';
module.exports.NOT_EQUAL = '!=';
module.exports.NOT_EQUAL_ALTERNATIVE = '<>';
module.exports.NOT_IDENTICALLY = '!==';
module.exports.LESS = '<';
module.exports.GREATER = '>';
module.exports.LESS_OR_EQUAL = '<=';
module.exports.GREATER_OR_EQUAL = '>=';
