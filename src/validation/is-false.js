'use strict';

var _ = require('lodash');

var check = function (value) {
    if (!_.isBoolean(value)) {
        throw Error('Expected boolean, given ' + _.toString(value));
    }

    return value === false;
};

module.exports = function () {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(value))
        });
    }
};
