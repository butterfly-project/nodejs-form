'use strict';

const check = value => {
    return value === null;
};

module.exports = () => value => {
    return new Promise(resolve => resolve(check(value)));
};
