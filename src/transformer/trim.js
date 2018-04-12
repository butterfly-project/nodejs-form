'use strict';

var filter = function (value) {
    return value.trim();
};

module.exports = function () {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(filter(value))
        });
    }
};
