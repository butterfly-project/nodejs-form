'use strict';

const _ = require('lodash');

const compare = (operator, expected, real) => {
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

module.exports = (expected, operator) => value => {
    return new Promise(resolve => {
        if (!_.isArray(value)) {
            throw Error('Expected array, given ' + _.toString(value));
        }

        resolve(compare(operator, expected, value.length));
    });
};

module.exports.EQUAL = '=';
module.exports.NOT_EQUAL = '!=';
module.exports.LESS = '<';
module.exports.GREATER = '>';
module.exports.LESS_OR_EQUAL = '<=';
module.exports.GREATER_OR_EQUAL = '>=';
