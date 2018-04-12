'use strict';

var _ = require('lodash');

var compositeResult = function (type) {
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
var compositeResults = function (results, type) {
    var firstResult = results.shift();

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

            var promises = _.map(validators, function (validator) {
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
