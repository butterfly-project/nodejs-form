'use strict';

const _ = require('lodash');

module.exports = transformers => value => {
    return new Promise(resolve => {
        if (transformers.length === 0) {
            resolve(value);
            return;
        }

        const workTransformers = _.cloneDeep(transformers);
        let promise = workTransformers.shift()(value);
        _.map(workTransformers, transformer => {
            promise = promise.then(transformer);
        });
        promise.then(result => resolve(result));
    });
};
