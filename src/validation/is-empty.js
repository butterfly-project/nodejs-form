'use strict';

var check = function (value) {
    return !value;
};

module.exports = function () {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(value))
        });
    }
};
