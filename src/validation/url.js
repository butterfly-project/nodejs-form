'use strict';

const check = (simple, value) => {
    let re;
    if (simple) {
        re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else {
        re = /^http(s)?:\/\/.(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    }

    return re.test(String(value).toLowerCase());
};

module.exports = (simple = false) => value => {
    return new Promise(resolve => resolve(check(simple, value)));
};
