'use strict';

module.exports = expectedKey => value => {
    return new Promise(resolve => {
        resolve(expectedKey in value);
    });
};
