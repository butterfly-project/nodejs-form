'use strict';

module.exports = function (expectedKey) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(expectedKey in value);
        });
    }
};
