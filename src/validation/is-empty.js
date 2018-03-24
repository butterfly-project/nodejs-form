'use strict';

const check = value => {
    return !value;
};

module.exports = () => value => {
    return new Promise(resolve => resolve(check(value)));
};
