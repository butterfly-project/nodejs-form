'use strict';

const _ = require('lodash');

const compare = function (operator, expected, real) {
    switch (operator) {
        case module.exports.EQUAL:
            return real === expected;
        case module.exports.NOT_EQUAL:
            return real !== expected;
        case module.exports.LESS:
            return real < expected;
        case module.exports.GREATER:
            return real > expected;
        case module.exports.LESS_OR_EQUAL:
            return real <= expected;
        case module.exports.GREATER_OR_EQUAL:
            return real >= expected;
        default:
            throw Error('Undefined operator ' + operator);
    }
};

module.exports = function (expected, operator = module.exports.EQUAL) {
    return function (value) {
        return new Promise(function(resolve) {
            if (!_.isString(value)) {
                throw Error('Expected string, given ' + _.toString(value));
            }

            resolve(compare(operator, expected, value.length));
        });
    }
};

module.exports.EQUAL = '=';
module.exports.NOT_EQUAL = '!=';
module.exports.LESS = '<';
module.exports.GREATER = '>';
module.exports.LESS_OR_EQUAL = '<=';
module.exports.GREATER_OR_EQUAL = '>=';
