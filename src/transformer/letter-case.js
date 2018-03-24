'use strict';

const _ = require('lodash');

const filterModeFunctions = {
    'lower_case': value => value.toLowerCase(),
    'upper_case': value => value.toUpperCase(),
    'upper_case_words': value => value.replace(/\w\S*/g, txt => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())),
    'upper_case_first': value => (value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()),
};

const filter = (mode, value) => {
    if (!_.isString(value)) {
        throw Error('Expected string, given ' + _.toString(value));
    }

    return filterModeFunctions[mode](value);
};

module.exports = mode => value => {
    return new Promise(resolve => resolve(filter(mode, value)));
};

module.exports.LOWER_CASE         = 'lower_case';
module.exports.UPPER_CASE         = 'upper_case';
module.exports.UPPER_CASE_WORDS   = 'upper_case_words';
module.exports.UPPER_CASE_FIRST   = 'upper_case_first';
