'use strict';

const chai = require('chai');
const mocha = require('mocha');
const
    describe = mocha.describe,
    it = mocha.it,
    assert = chai.assert;

assert.promiseEqual = (promise, expected) => {
    promise
        .then(result => assert.equal(expected, result))
        .catch(() => assert.ok(false));
};
assert.promiseOk = promise => {
    promise
        .then(() => assert.ok(true))
        .catch(() => assert.ok(false));
};
assert.promiseFail = promise => {
    promise
        .then(() => assert.ok(false))
        .catch(() => assert.ok(true));
};

const defineTest = testModule => testModule({describe, it, assert});

module.exports = defineTest;
