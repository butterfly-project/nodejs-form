'use strict';

const check = function (regexp, value) {
    return regexp.test(String(value).toLowerCase());
};

module.exports = function (regexp) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(regexp, value))
        });
    }
};
