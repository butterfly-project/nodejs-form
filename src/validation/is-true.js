'use strict';

const _ = require('lodash');

const check = function (value) {
    if (!_.isBoolean(value)) {
        throw Error('Expected boolean, given ' + _.toString(value));
    }

    return value === true;
};

module.exports = function () {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(value))
        });
    }
};
