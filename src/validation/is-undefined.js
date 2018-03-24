'use strict';

const check = value => {
    return value === undefined;
};

module.exports = () => value => {
    return new Promise(resolve => resolve(check(value)));
};
