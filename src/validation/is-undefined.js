'use strict';

var check = function (value) {
    return value === undefined;
};

module.exports = function () {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(value))
        });
    }
};
