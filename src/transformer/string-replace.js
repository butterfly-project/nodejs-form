'use strict';

var filter = function (pattern, replacement, value) {
    return value.replace(pattern, replacement);
};

module.exports = function (pattern, replacement) {
    return function (value) {
        return new Promise(function (resolve) {
            return resolve(filter(pattern, replacement, value));
        });
    }
};
