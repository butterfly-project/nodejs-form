'use strict';

const _ = require('lodash');

const typeFilters = {
    'boolean': function (value) {
        return !!value;
    },
    'number': function (value) {
        return _.toNumber(value);
    },
    'string': function (value) {
        return value.toString();
    },
};

const filter = function (type, value) {
    return typeFilters[type](value);
};

module.exports = function (type) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(filter(type, value));
        });
    }
};

module.exports.TYPE_BOOLEAN = 'boolean';
module.exports.TYPE_NUMBER = 'number';
module.exports.TYPE_STRING = 'string';