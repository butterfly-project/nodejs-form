'use strict';

const _ = require('lodash');

const compositeResult = type => (a, b) => {
    switch (type) {
        case module.exports.AND:
            return !!(a && b);
        case module.exports.OR:
            return !!(a || b);
        case module.exports.XOR:
            return !a ^ !b;
        default:
            throw Error('Undefined type ' + type);
    }
};
const compositeResults = (results, type) => {
    const firstResult = results.shift();

    return _.reduce(results, compositeResult(type), firstResult);
};

module.exports = (validators, type = module.exports.AND) => value => {
    return new Promise(resolve => {
        if (validators.length === 0) {
            resolve(true);
            return;
        }

        const promises = _.map(validators, validator => validator(value));

        Promise.all(promises).then(results => {
            resolve(compositeResults(results, type));
        });
    });
};

module.exports.AND = 'and';
module.exports.OR  = 'or';
module.exports.XOR = 'xor';
