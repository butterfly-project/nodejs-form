'use strict';

const _ = require('lodash');

const check = value => {
    if (!_.isBoolean(value)) {
        throw Error('Expected boolean, given ' + _.toString(value));
    }

    return value === true;
};

module.exports = () => value => {
    return new Promise(resolve => resolve(check(value)));
};
