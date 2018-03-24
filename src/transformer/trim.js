'use strict';

const filter = value => {
    return value.trim();
};

module.exports = () => value => {
    return new Promise(resolve => resolve(filter(value)));
};
