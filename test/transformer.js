'use strict';

const defineTest = require('./../utils/testwrap');
const t = require('./../transformer');

defineTest(({describe, it, assert}) => {

    describe("jsonDecode", () => {
        it("check", () => {
            assert.promiseEqualDeep(t.jsonDecode()('{"foo":123,"bar":456}'), {foo: 123, bar: 456});
        });
    });

    describe("jsonEncode", () => {
        it("check", () => {
            assert.promiseEqualDeep(t.jsonEncode()({foo: 123, bar: 456}), '{"foo":123,"bar":456}');
        });
    });

    describe("letterCase", () => {
        it("check", () => {
            assert.promiseEqual(t.letterCase(t.letterCase.LOWER_CASE)('jHoN sMiTcH'), 'jhon smitch');
            assert.promiseEqual(t.letterCase(t.letterCase.UPPER_CASE)('jHoN sMiTcH'), 'JHON SMITCH');
            assert.promiseEqual(t.letterCase(t.letterCase.UPPER_CASE_WORDS)('jHoN sMiTcH'), 'Jhon Smitch');
            assert.promiseEqual(t.letterCase(t.letterCase.UPPER_CASE_FIRST)('jHoN sMiTcH'), 'Jhon smitch');
        });
    });

    describe("mapper", () => {
        const map = {
            foo: 123
        };

        it("check", () => {
            assert.promiseEqual(t.mapper(map)('foo'), 123);
            assert.promiseEqual(t.mapper(map)('bar'), undefined);
            assert.promiseEqual(t.mapper(map, null)('foo'), 123);
            assert.promiseEqual(t.mapper(map, null)('bar'), null);
        });
    });

    describe("stringReplace", () => {
        it("check", () => {
            assert.promiseEqual(t.stringReplace('-', '+')('1-2'), '1+2');
            assert.promiseEqual(t.stringReplace(/[a-z]/g, '_')('abc123'), '___123');
        });
    });

    describe("stringLimit", () => {
        it("check", () => {
            assert.promiseEqual(t.stringLimit(5)('1234567890'), '12345');
            assert.promiseEqual(t.stringLimit(5)('123'), '123');
        });
    });

    describe("toType", () => {
        it("boolean", () => {
            assert.promiseEqual(t.toType(t.toType.TYPE_BOOLEAN)(true), true);
            assert.promiseEqual(t.toType(t.toType.TYPE_BOOLEAN)(false), false);
            assert.promiseEqual(t.toType(t.toType.TYPE_BOOLEAN)(123), true);
            assert.promiseEqual(t.toType(t.toType.TYPE_BOOLEAN)(0), false);
            assert.promiseEqual(t.toType(t.toType.TYPE_BOOLEAN)('abc'), true);
            assert.promiseEqual(t.toType(t.toType.TYPE_BOOLEAN)(''), false);
        });

        it("number", () => {
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)(true), 1);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)(false), 0);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)(123), 123);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)(0), 0);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)(10.10), 10.10);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)(''), 0);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)('10'), 10);
            assert.promiseEqual(t.toType(t.toType.TYPE_NUMBER)('10.10'), 10.10);
        });

        it("string", () => {
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)(true), 'true');
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)(false), 'false');
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)(123), '123');
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)(0), '0');
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)(10.10), '10.1');
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)(''), '');
            assert.promiseEqual(t.toType(t.toType.TYPE_STRING)('abc'), 'abc');
        });
    });

    describe("trim", () => {
        it("check", () => {
            assert.promiseEqual(t.trim()('abc'), 'abc');
            assert.promiseEqual(t.trim()(' abc'), 'abc');
            assert.promiseEqual(t.trim()('abc '), 'abc');
            assert.promiseEqual(t.trim()(' abc '), 'abc');
            assert.promiseEqual(t.trim()(''), '');
        });
    });

    describe("composite", () => {
        it("check", () => {
            const replacer = t.stringReplace(/[a-z]/g, ' ');
            const trimer = t.trim();
            const toNumber = t.toType(t.toType.TYPE_NUMBER);

            const transformers = [
                replacer,
                trimer,
                toNumber,
            ];

            assert.promiseEqual(t.composite(transformers)('ab123cd'), 123);
        });
    });

});
