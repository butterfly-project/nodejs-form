'use strict';

const filter = function (limit, value) {
    return value.substr(0, limit);
};

module.exports = function (limit) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(filter(limit, value))
        });
    }
};
