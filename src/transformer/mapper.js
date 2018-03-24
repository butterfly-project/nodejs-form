'use strict';

const filter = (map, defaultValue, value) => {
    return (value in map) ? map[value] : defaultValue;
};

module.exports = (map, defaultValue) => value => {
    return new Promise(resolve => resolve(filter(map, defaultValue, value)));
};
