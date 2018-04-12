'use strict';

var check = function (simple, value) {
    var re;
    if (simple) {
        re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else {
        re = /^http(s)?:\/\/.(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    }

    return re.test(String(value).toLowerCase());
};

module.exports = function (simple) {
    simple = simple || false;

    return function (value) {
        return new Promise(function (resolve) {
            resolve(check(simple, value))
        });
    }
};
