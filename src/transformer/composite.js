'use strict';

var _ = require('lodash');

module.exports = function (transformers) {
    return function (value) {
        return new Promise(function (resolve) {
            if (transformers.length === 0) {
                resolve(value);
                return;
            }

            var workTransformers = _.cloneDeep(transformers);
            var promise = workTransformers.shift()(value);
            _.map(workTransformers, function (transformer) {
                promise = promise.then(transformer);
            });
            promise.then(function (result) {
                resolve(result)
            });
        });
    }
};
