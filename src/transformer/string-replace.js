'use strict';

const filter = (pattern, replacement, value) => {
    return value.replace(pattern, replacement);
};

module.exports = (pattern, replacement) => value => {
    return new Promise(resolve => resolve(filter(pattern, replacement, value)));
};
