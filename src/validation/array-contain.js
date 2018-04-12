'use strict';

module.exports = function (expected) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(-1 !== expected.indexOf(value));
        });
    }
};
