'use strict';

module.exports = function () {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(JSON.parse(value))
        });
    }
};
