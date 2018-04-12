'use strict';

const filter = function (map, defaultValue, value) {
    return (value in map) ? map[value] : defaultValue;
};

module.exports = function (map, defaultValue) {
    return function (value) {
        return new Promise(function (resolve) {
            resolve(filter(map, defaultValue, value));
        });
    }
};
