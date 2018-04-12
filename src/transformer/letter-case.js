'use strict';

var _ = require('lodash');

var filterModeFunctions = {
    'lower_case': function (value) {
        return value.toLowerCase()
    },
    'upper_case': function (value) {
        return value.toUpperCase()
    },
    'upper_case_words': function (value) {
        return value.replace(/\w\S*/g, function (txt) {
            return (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        })
    },
    'upper_case_first': function (value) {
        return (value.charAt(0).toUpperCase() + value.substr(1).toLowerCase());
    },
};

var filter = function (mode, value) {
    if (!_.isString(value)) {
        throw Error('Expected string, given ' + _.toString(value));
    }

    return filterModeFunctions[mode](value);
};

module.exports = function (mode) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(filter(mode, value));
        });
    }
};

module.exports.LOWER_CASE = 'lower_case';
module.exports.UPPER_CASE = 'upper_case';
module.exports.UPPER_CASE_WORDS = 'upper_case_words';
module.exports.UPPER_CASE_FIRST = 'upper_case_first';
