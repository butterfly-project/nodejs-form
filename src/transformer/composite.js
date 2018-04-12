'use strict';

const _ = require('lodash');

module.exports = function (transformers) {
    return function (value) {
        return new Promise(function (resolve) {
            if (transformers.length === 0) {
                resolve(value);
                return;
            }

            const workTransformers = _.cloneDeep(transformers);
            let promise = workTransformers.shift()(value);
            _.map(workTransformers, function (transformer) {
                promise = promise.then(transformer);
            });
            promise.then(function (result) {
                resolve(result)
            });
        });
    }
};
