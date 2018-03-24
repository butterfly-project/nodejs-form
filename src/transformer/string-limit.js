'use strict';

const filter = (limit, value) => {
    return value.substr(0, limit);
};

module.exports = limit => value => {
    return new Promise(resolve => resolve(filter(limit, value)));
};
