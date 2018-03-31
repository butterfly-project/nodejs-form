'use strict';

module.exports = expected => value => {
    return new Promise(resolve => {
        resolve(-1 !== expected.indexOf(value));
    });
};
