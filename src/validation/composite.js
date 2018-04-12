'use strict';

const _ = require('lodash');

const compositeResult = function (type) {
    return function (a, b) {
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
    }
};
const compositeResults = function (results, type) {
    const firstResult = results.shift();

    return _.reduce(results, compositeResult(type), firstResult);
};

module.exports = function (validators, type) {
    type = type || module.exports.AND;

    return function (value) {
        return new Promise(function (resolve) {
            if (validators.length === 0) {
                resolve(true);
                return;
            }

            const promises = _.map(validators, function (validator) {
                return validator(value)
            });

            Promise.all(promises).then(function (results) {
                resolve(compositeResults(results, type));
            });
        });
    }
};

module.exports.AND = 'and';
module.exports.OR = 'or';
module.exports.XOR = 'xor';
