'use strict';

const _ = require('lodash');

const typeFilters = {
    'boolean': value => !!value,
    'number': value => _.toNumber(value),
    'string': value => value.toString(),
};

const filter = (type, value) => {
    return typeFilters[type](value);
};

module.exports = type => value => {
    return new Promise(resolve => resolve(filter(type, value)));
};

module.exports.TYPE_BOOLEAN = 'boolean';
module.exports.TYPE_NUMBER  = 'number';
module.exports.TYPE_STRING  = 'string';