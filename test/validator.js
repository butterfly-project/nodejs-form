'use strict';

const defineTest = require('./../utils/testwrap');
const validator = require('./../validator');

defineTest(({describe, it, assert}) => {

    describe("objectHasKey", () => {
        it("ok", () => {
            assert.promiseEqual(validator.objectHasKey('a')({a: 1}), true);
        });
        it("fail", () => {
            assert.promiseEqual(validator.objectHasKey('b')({a: 1}), false);
        });
    });

    describe("arrayContains", () => {
        it("ok", () => {
            assert.promiseEqual(validator.arrayContain('a')(['a']), true);
        });
        it("fail", () => {
            assert.promiseEqual(validator.arrayContain('b')(['a']), false);
        });
    });

    describe("arrayLength", () => {
        it("equal", () => {
            assert.promiseEqual(validator.arrayLength(1, validator.arrayLength.EQUAL)([1]), true);
        });
        it("equal fail", () => {
            assert.promiseEqual(validator.arrayLength(1, validator.arrayLength.EQUAL)([]), false);
        });
        it("not_equal", () => {
            assert.promiseEqual(validator.arrayLength(2, validator.arrayLength.NOT_EQUAL)([1]), true);
        });
        it("not_equal fail", () => {
            assert.promiseEqual(validator.arrayLength(0, validator.arrayLength.NOT_EQUAL)([]), false);
        });
        it("less", () => {
            assert.promiseEqual(validator.arrayLength(5, validator.arrayLength.LESS)([1,2,3]), true);
        });
        it("less fail", () => {
            assert.promiseEqual(validator.arrayLength(2, validator.arrayLength.LESS)([1,2,3]), false);
        });
        it("greater", () => {
            assert.promiseEqual(validator.arrayLength(2, validator.arrayLength.GREATER)([1,2,3]), true);
        });
        it("greater fail", () => {
            assert.promiseEqual(validator.arrayLength(5, validator.arrayLength.GREATER)([1,2,3]), false);
        });
        it("less_or_equal", () => {
            assert.promiseEqual(validator.arrayLength(5, validator.arrayLength.LESS_OR_EQUAL)([1,2,3]), true);
        });
        it("less_or_equal 2", () => {
            assert.promiseEqual(validator.arrayLength(3, validator.arrayLength.LESS_OR_EQUAL)([1,2,3]), true);
        });
        it("less_or_equal fail", () => {
            assert.promiseEqual(validator.arrayLength(1, validator.arrayLength.LESS_OR_EQUAL)([1,2,3]), false);
        });
        it("greater_or_equal", () => {
            assert.promiseEqual(validator.arrayLength(1, validator.arrayLength.GREATER_OR_EQUAL)([1,2,3]), true);
        });
        it("greater_or_equal 2", () => {
            assert.promiseEqual(validator.arrayLength(3, validator.arrayLength.GREATER_OR_EQUAL)([1,2,3]), true);
        });
        it("greater_or_equal fail", () => {
            assert.promiseEqual(validator.arrayLength(5, validator.arrayLength.GREATER_OR_EQUAL)([1,2,3]), false);
        });
    });

    describe("stringLength", () => {
        it("equal", () => {
            assert.promiseEqual(validator.stringLength(1, validator.stringLength.EQUAL)('a'), true);
        });
        it("equal fail", () => {
            assert.promiseEqual(validator.stringLength(1, validator.stringLength.EQUAL)(''), false);
        });
        it("not_equal", () => {
            assert.promiseEqual(validator.stringLength(2, validator.stringLength.NOT_EQUAL)(''), true);
        });
        it("not_equal fail", () => {
            assert.promiseEqual(validator.stringLength(0, validator.stringLength.NOT_EQUAL)(''), false);
        });
        it("less", () => {
            assert.promiseEqual(validator.stringLength(5, validator.stringLength.LESS)('abc'), true);
        });
        it("less fail", () => {
            assert.promiseEqual(validator.stringLength(2, validator.stringLength.LESS)('abc'), false);
        });
        it("greater", () => {
            assert.promiseEqual(validator.stringLength(2, validator.stringLength.GREATER)('abc'), true);
        });
        it("greater fail", () => {
            assert.promiseEqual(validator.stringLength(5, validator.stringLength.GREATER)('abc'), false);
        });
        it("less_or_equal", () => {
            assert.promiseEqual(validator.stringLength(5, validator.stringLength.LESS_OR_EQUAL)('abc'), true);
        });
        it("less_or_equal 2", () => {
            assert.promiseEqual(validator.stringLength(3, validator.stringLength.LESS_OR_EQUAL)('abc'), true);
        });
        it("less_or_equal fail", () => {
            assert.promiseEqual(validator.stringLength(1, validator.stringLength.LESS_OR_EQUAL)('abc'), false);
        });
        it("greater_or_equal", () => {
            assert.promiseEqual(validator.stringLength(1, validator.stringLength.GREATER_OR_EQUAL)('abc'), true);
        });
        it("greater_or_equal 2", () => {
            assert.promiseEqual(validator.stringLength(3, validator.stringLength.GREATER_OR_EQUAL)('abc'), true);
        });
        it("greater_or_equal fail", () => {
            assert.promiseEqual(validator.stringLength(5, validator.stringLength.GREATER_OR_EQUAL)('abc'), false);
        });
    });

    describe("compare", () => {
        it("equal", () => {
            assert.promiseEqual(validator.compare('5', validator.compare.EQUAL)(5), true);
        });
        it("equal fail", () => {
            assert.promiseEqual(validator.compare(1, validator.compare.EQUAL)(5), false);
        });
        it("not_equal", () => {
            assert.promiseEqual(validator.compare(1, validator.compare.NOT_EQUAL)(5), true);
        });
        it("not_equal fail", () => {
            assert.promiseEqual(validator.compare('5', validator.compare.NOT_EQUAL)(5), false);
        });
        it("identically", () => {
            assert.promiseEqual(validator.compare(5, validator.compare.IDENTICALLY)(5), true);
        });
        it("identically fail", () => {
            assert.promiseEqual(validator.compare(1, validator.compare.IDENTICALLY)(5), false);
        });
        it("not_identically", () => {
            assert.promiseEqual(validator.compare(1, validator.compare.NOT_IDENTICALLY)(5), true);
        });
        it("not_identically fail", () => {
            assert.promiseEqual(validator.compare(5, validator.compare.NOT_IDENTICALLY)(5), false);
        });
        it("less", () => {
            assert.promiseEqual(validator.compare(10, validator.compare.LESS)(5), true);
        });
        it("less fail", () => {
            assert.promiseEqual(validator.compare(2, validator.compare.LESS)(5), false);
        });
        it("greater", () => {
            assert.promiseEqual(validator.compare(2, validator.compare.GREATER)(5), true);
        });
        it("greater fail", () => {
            assert.promiseEqual(validator.compare(5, validator.compare.GREATER)(5), false);
        });
        it("less_or_equal", () => {
            assert.promiseEqual(validator.compare(5, validator.compare.LESS_OR_EQUAL)(5), true);
        });
        it("less_or_equal 2", () => {
            assert.promiseEqual(validator.compare(10, validator.compare.LESS_OR_EQUAL)(5), true);
        });
        it("less_or_equal fail", () => {
            assert.promiseEqual(validator.compare(1, validator.compare.LESS_OR_EQUAL)(5), false);
        });
        it("greater_or_equal", () => {
            assert.promiseEqual(validator.compare(1, validator.compare.GREATER_OR_EQUAL)(5), true);
        });
        it("greater_or_equal 2", () => {
            assert.promiseEqual(validator.compare(5, validator.compare.GREATER_OR_EQUAL)(5), true);
        });
        it("greater_or_equal fail", () => {
            assert.promiseEqual(validator.compare(10, validator.compare.GREATER_OR_EQUAL)(5), false);
        });
    });

    describe("email", () => {
        it("email", () => {
            assert.promiseEqual(validator.email()('abc@mailforspam.com'), true);
            assert.promiseEqual(validator.email()('abcmailforspam.com'), false);
        });
    });

    describe("isEmpty", () => {
        it("check", () => {
            assert.promiseEqual(validator.isEmpty()(), true);
            assert.promiseEqual(validator.isEmpty()(null), true);
            assert.promiseEqual(validator.isEmpty()(false), true);
            assert.promiseEqual(validator.isEmpty()(''), true);
            assert.promiseEqual(validator.isEmpty()(0), true);
            assert.promiseEqual(validator.isEmpty()([]), false);
            assert.promiseEqual(validator.isEmpty()({}), false);
            assert.promiseEqual(validator.isEmpty()('a'), false);
        });
    });

    describe("isNotEmpty", () => {
        it("check", () => {
            assert.promiseEqual(validator.isNotEmpty()(), false);
            assert.promiseEqual(validator.isNotEmpty()(null), false);
            assert.promiseEqual(validator.isNotEmpty()(false), false);
            assert.promiseEqual(validator.isNotEmpty()(''), false);
            assert.promiseEqual(validator.isNotEmpty()(0), false);
            assert.promiseEqual(validator.isNotEmpty()([]), true);
            assert.promiseEqual(validator.isNotEmpty()({}), true);
            assert.promiseEqual(validator.isNotEmpty()('a'), true);
        });
    });

    describe("isNull", () => {
        it("check", () => {
            assert.promiseEqual(validator.isNull()(null), true);
            assert.promiseEqual(validator.isNull()('a'), false);
        });
    });

    describe("isNotNull", () => {
        it("check", () => {
            assert.promiseEqual(validator.isNotNull()(null), false);
            assert.promiseEqual(validator.isNotNull()('a'), true);
        });
    });

    describe("isUndefined", () => {
        it("check", () => {
            assert.promiseEqual(validator.isUndefined()(), true);
            assert.promiseEqual(validator.isUndefined()(null), false);
        });
    });

    describe("isNotUndefined", () => {
        it("check", () => {
            assert.promiseEqual(validator.isNotUndefined()(), false);
            assert.promiseEqual(validator.isNotUndefined()(null), true);
        });
    });

    describe("isFalse", () => {
        it("check", () => {
            assert.promiseEqual(validator.isFalse()(false), true);
            assert.promiseEqual(validator.isFalse()(true), false);
        });
    });

    describe("isTrue", () => {
        it("check", () => {
            assert.promiseEqual(validator.isTrue()(true), true);
            assert.promiseEqual(validator.isTrue()(false), false);
        });
    });

    describe("regexp", () => {
        it("check", () => {
            assert.promiseEqual(validator.regexp(/[a-z]{5}/)('abcdef'), true);
            assert.promiseEqual(validator.regexp(/[a-z]{5}/)('abc'), false);
        });
    });

    describe("isType", () => {
        it("check", () => {
            assert.promiseEqual(validator.isType(validator.isType.TYPE_UNDEFINED)(), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_UNDEFINED)(undefined), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_NULL)(null), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_NULL)(), false);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_BOOLEAN)(true), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_BOOLEAN)(false), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_NUMBER)(10), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_NUMBER)(10.10), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_STRING)('abc'), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_ARRAY)([]), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_OBJECT)({}), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_FUNCTION)(() => {}), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_DATE)(new Date), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_REGEXP)(/abc/), true);
            assert.promiseEqual(validator.isType(validator.isType.TYPE_REGEXP)('abc'), false);
        });
    });


});
