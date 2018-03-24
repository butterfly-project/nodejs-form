'use strict';

module.exports = () => value => {
    return new Promise(resolve => resolve(JSON.stringify(value)));
};
