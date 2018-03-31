'use strict';

const defineTest = require('./../utils/testwrap');
const v = require('./../validator');

defineTest(({describe, it, assert}) => {

    describe("objectHasKey", () => {
        it("ok", () => {
            assert.promiseEqual(v.objectHasKey('a')({a: 1}), true);
        });
        it("fail", () => {
            assert.promiseEqual(v.objectHasKey('b')({a: 1}), false);
        });
    });

    describe("arrayContains", () => {
        it("ok", () => {
            assert.promiseEqual(v.arrayContain(['a'])('a'), true);
        });
        it("fail", () => {
            assert.promiseEqual(v.arrayContain(['a'])('b'), false);
        });
    });

    describe("arrayLength", () => {
        it("equal", () => {
            assert.promiseEqual(v.arrayLength(1, v.arrayLength.EQUAL)([1]), true);
        });
        it("equal fail", () => {
            assert.promiseEqual(v.arrayLength(1, v.arrayLength.EQUAL)([]), false);
        });
        it("not_equal", () => {
            assert.promiseEqual(v.arrayLength(2, v.arrayLength.NOT_EQUAL)([1]), true);
        });
        it("not_equal fail", () => {
            assert.promiseEqual(v.arrayLength(0, v.arrayLength.NOT_EQUAL)([]), false);
        });
        it("less", () => {
            assert.promiseEqual(v.arrayLength(5, v.arrayLength.LESS)([1,2,3]), true);
        });
        it("less fail", () => {
            assert.promiseEqual(v.arrayLength(2, v.arrayLength.LESS)([1,2,3]), false);
        });
        it("greater", () => {
            assert.promiseEqual(v.arrayLength(2, v.arrayLength.GREATER)([1,2,3]), true);
        });
        it("greater fail", () => {
            assert.promiseEqual(v.arrayLength(5, v.arrayLength.GREATER)([1,2,3]), false);
        });
        it("less_or_equal", () => {
            assert.promiseEqual(v.arrayLength(5, v.arrayLength.LESS_OR_EQUAL)([1,2,3]), true);
        });
        it("less_or_equal 2", () => {
            assert.promiseEqual(v.arrayLength(3, v.arrayLength.LESS_OR_EQUAL)([1,2,3]), true);
        });
        it("less_or_equal fail", () => {
            assert.promiseEqual(v.arrayLength(1, v.arrayLength.LESS_OR_EQUAL)([1,2,3]), false);
        });
        it("greater_or_equal", () => {
            assert.promiseEqual(v.arrayLength(1, v.arrayLength.GREATER_OR_EQUAL)([1,2,3]), true);
        });
        it("greater_or_equal 2", () => {
            assert.promiseEqual(v.arrayLength(3, v.arrayLength.GREATER_OR_EQUAL)([1,2,3]), true);
        });
        it("greater_or_equal fail", () => {
            assert.promiseEqual(v.arrayLength(5, v.arrayLength.GREATER_OR_EQUAL)([1,2,3]), false);
        });
    });

    describe("stringLength", () => {
        it("equal", () => {
            assert.promiseEqual(v.stringLength(1, v.stringLength.EQUAL)('a'), true);
        });
        it("equal fail", () => {
            assert.promiseEqual(v.stringLength(1, v.stringLength.EQUAL)(''), false);
        });
        it("not_equal", () => {
            assert.promiseEqual(v.stringLength(2, v.stringLength.NOT_EQUAL)(''), true);
        });
        it("not_equal fail", () => {
            assert.promiseEqual(v.stringLength(0, v.stringLength.NOT_EQUAL)(''), false);
        });
        it("less", () => {
            assert.promiseEqual(v.stringLength(5, v.stringLength.LESS)('abc'), true);
        });
        it("less fail", () => {
            assert.promiseEqual(v.stringLength(2, v.stringLength.LESS)('abc'), false);
        });
        it("greater", () => {
            assert.promiseEqual(v.stringLength(2, v.stringLength.GREATER)('abc'), true);
        });
        it("greater fail", () => {
            assert.promiseEqual(v.stringLength(5, v.stringLength.GREATER)('abc'), false);
        });
        it("less_or_equal", () => {
            assert.promiseEqual(v.stringLength(5, v.stringLength.LESS_OR_EQUAL)('abc'), true);
        });
        it("less_or_equal 2", () => {
            assert.promiseEqual(v.stringLength(3, v.stringLength.LESS_OR_EQUAL)('abc'), true);
        });
        it("less_or_equal fail", () => {
            assert.promiseEqual(v.stringLength(1, v.stringLength.LESS_OR_EQUAL)('abc'), false);
        });
        it("greater_or_equal", () => {
            assert.promiseEqual(v.stringLength(1, v.stringLength.GREATER_OR_EQUAL)('abc'), true);
        });
        it("greater_or_equal 2", () => {
            assert.promiseEqual(v.stringLength(3, v.stringLength.GREATER_OR_EQUAL)('abc'), true);
        });
        it("greater_or_equal fail", () => {
            assert.promiseEqual(v.stringLength(5, v.stringLength.GREATER_OR_EQUAL)('abc'), false);
        });
    });

    describe("compare", () => {
        it("equal", () => {
            assert.promiseEqual(v.compare('5', v.compare.EQUAL)(5), true);
        });
        it("equal fail", () => {
            assert.promiseEqual(v.compare(1, v.compare.EQUAL)(5), false);
        });
        it("not_equal", () => {
            assert.promiseEqual(v.compare(1, v.compare.NOT_EQUAL)(5), true);
        });
        it("not_equal fail", () => {
            assert.promiseEqual(v.compare('5', v.compare.NOT_EQUAL)(5), false);
        });
        it("identically", () => {
            assert.promiseEqual(v.compare(5, v.compare.IDENTICALLY)(5), true);
        });
        it("identically fail", () => {
            assert.promiseEqual(v.compare(1, v.compare.IDENTICALLY)(5), false);
        });
        it("not_identically", () => {
            assert.promiseEqual(v.compare(1, v.compare.NOT_IDENTICALLY)(5), true);
        });
        it("not_identically fail", () => {
            assert.promiseEqual(v.compare(5, v.compare.NOT_IDENTICALLY)(5), false);
        });
        it("less", () => {
            assert.promiseEqual(v.compare(10, v.compare.LESS)(5), true);
        });
        it("less fail", () => {
            assert.promiseEqual(v.compare(2, v.compare.LESS)(5), false);
        });
        it("greater", () => {
            assert.promiseEqual(v.compare(2, v.compare.GREATER)(5), true);
        });
        it("greater fail", () => {
            assert.promiseEqual(v.compare(5, v.compare.GREATER)(5), false);
        });
        it("less_or_equal", () => {
            assert.promiseEqual(v.compare(5, v.compare.LESS_OR_EQUAL)(5), true);
        });
        it("less_or_equal 2", () => {
            assert.promiseEqual(v.compare(10, v.compare.LESS_OR_EQUAL)(5), true);
        });
        it("less_or_equal fail", () => {
            assert.promiseEqual(v.compare(1, v.compare.LESS_OR_EQUAL)(5), false);
        });
        it("greater_or_equal", () => {
            assert.promiseEqual(v.compare(1, v.compare.GREATER_OR_EQUAL)(5), true);
        });
        it("greater_or_equal 2", () => {
            assert.promiseEqual(v.compare(5, v.compare.GREATER_OR_EQUAL)(5), true);
        });
        it("greater_or_equal fail", () => {
            assert.promiseEqual(v.compare(10, v.compare.GREATER_OR_EQUAL)(5), false);
        });
    });

    describe("email", () => {
        it("email", () => {
            assert.promiseEqual(v.email()('abc@mailforspam.com'), true);
            assert.promiseEqual(v.email()('abcmailforspam.com'), false);
        });
    });

    describe("url", () => {
        it("check", () => {
            assert.promiseEqual(v.url()('http://abc.mailforspam.com'), true);
            assert.promiseEqual(v.url()('https://mailforspam.com'), true);
            assert.promiseEqual(v.url()('abcmailforspam.com'), false);
            assert.promiseEqual(v.url(true)('abcmailforspam.com'), true);
        });
    });

    describe("isEmpty", () => {
        it("check", () => {
            assert.promiseEqual(v.isEmpty()(), true);
            assert.promiseEqual(v.isEmpty()(null), true);
            assert.promiseEqual(v.isEmpty()(false), true);
            assert.promiseEqual(v.isEmpty()(''), true);
            assert.promiseEqual(v.isEmpty()(0), true);
            assert.promiseEqual(v.isEmpty()([]), false);
            assert.promiseEqual(v.isEmpty()({}), false);
            assert.promiseEqual(v.isEmpty()('a'), false);
        });
    });

    describe("isNotEmpty", () => {
        it("check", () => {
            assert.promiseEqual(v.isNotEmpty()(), false);
            assert.promiseEqual(v.isNotEmpty()(null), false);
            assert.promiseEqual(v.isNotEmpty()(false), false);
            assert.promiseEqual(v.isNotEmpty()(''), false);
            assert.promiseEqual(v.isNotEmpty()(0), false);
            assert.promiseEqual(v.isNotEmpty()([]), true);
            assert.promiseEqual(v.isNotEmpty()({}), true);
            assert.promiseEqual(v.isNotEmpty()('a'), true);
        });
    });

    describe("isNull", () => {
        it("check", () => {
            assert.promiseEqual(v.isNull()(null), true);
            assert.promiseEqual(v.isNull()('a'), false);
        });
    });

    describe("isNotNull", () => {
        it("check", () => {
            assert.promiseEqual(v.isNotNull()(null), false);
            assert.promiseEqual(v.isNotNull()('a'), true);
        });
    });

    describe("isUndefined", () => {
        it("check", () => {
            assert.promiseEqual(v.isUndefined()(), true);
            assert.promiseEqual(v.isUndefined()(null), false);
        });
    });

    describe("isNotUndefined", () => {
        it("check", () => {
            assert.promiseEqual(v.isNotUndefined()(), false);
            assert.promiseEqual(v.isNotUndefined()(null), true);
        });
    });

    describe("isFalse", () => {
        it("check", () => {
            assert.promiseEqual(v.isFalse()(false), true);
            assert.promiseEqual(v.isFalse()(true), false);
        });
    });

    describe("isTrue", () => {
        it("check", () => {
            assert.promiseEqual(v.isTrue()(true), true);
            assert.promiseEqual(v.isTrue()(false), false);
        });
    });

    describe("regexp", () => {
        it("check", () => {
            assert.promiseEqual(v.regexp(/[a-z]{5}/)('abcdef'), true);
            assert.promiseEqual(v.regexp(/[a-z]{5}/)('abc'), false);
        });
    });

    describe("isType", () => {
        it("check", () => {
            assert.promiseEqual(v.isType(v.isType.TYPE_UNDEFINED)(), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_UNDEFINED)(undefined), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_NULL)(null), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_NULL)(), false);
            assert.promiseEqual(v.isType(v.isType.TYPE_BOOLEAN)(true), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_BOOLEAN)(false), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_NUMBER)(10), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_NUMBER)(10.10), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_STRING)('abc'), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_ARRAY)([]), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_OBJECT)({}), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_FUNCTION)(() => {}), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_DATE)(new Date), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_REGEXP)(/abc/), true);
            assert.promiseEqual(v.isType(v.isType.TYPE_REGEXP)('abc'), false);
        });
    });


});
