'use strict';

const check = (regexp, value) => {
    return regexp.test(String(value).toLowerCase());
};

module.exports = regexp => value => {
    return new Promise(resolve => resolve(check(regexp, value)));
};
