'use strict';

const defineTest = require('./../utils/testwrap');
const v = require('./../validator');
const t = require('./../transformer');
const scalarConstraint = require('./../scalar-constraint');

defineTest(({describe, it, assert}) => {

    describe("scalarConstraint", () => {
        it("standart", () => {
            const form = scalarConstraint()
                .addTransformer(t.trim())
                .saveValue('trim')
                .addValidator(v.isNotEmpty(), 'Value is empty', true)
                .restoreValue('before')
                .addValidator(v.stringLength(3), 'Value should be length 3')
            ;

            return form.filter(' a ')
                .then(({isValid, getValue, errorMessages, structuredErrorMessages, firstErrorMessage}) => {
                    assert.equal(isValid(), true);
                    assert.equal(getValue(), ' a ');
                    assert.equal(getValue('before'), ' a ');
                    assert.equal(getValue('trim'), 'a');
                    assert.equal(getValue('after'), ' a ');
                    assert.equal(errorMessages().length, 0);
                    assert.equal(structuredErrorMessages().length, 0);
                    assert.equal(firstErrorMessage(), null);
                });
        });
        it("validator fatal", () => {
            const form = scalarConstraint()
                .addTransformer(t.trim())
                .saveValue('trim')
                .addValidator(v.isNotEmpty(), 'Value is empty', true)
                .restoreValue('before')
                .addValidator(v.stringLength(3), 'Value should be length 3')
            ;

            return form.filter(' ')
                .then(({isValid, getValue, errorMessages, structuredErrorMessages, firstErrorMessage}) => {
                    assert.equal(isValid(), false);
                    assert.equal(getValue(), '');
                    assert.equal(getValue('before'), ' ');
                    assert.equal(getValue('trim'), '');
                    assert.equal(getValue('after'), '');
                    assert.equal(errorMessages().length, 1);
                    assert.equal(structuredErrorMessages().length, 1);
                    assert.equal(firstErrorMessage(), 'Value is empty');
                });
        });
        it("validator", () => {
            const form = scalarConstraint()
                .addValidator(v.isNotEmpty(), 'Value is empty')
                .addValidator(v.stringLength(3), 'Value should be length 3')
            ;

            return form.filter('')
                .then(({isValid, getValue, errorMessages, firstErrorMessage}) => {
                    assert.equal(isValid(), false);
                    assert.equal(getValue(), '');
                    assert.equal(errorMessages().length, 2);
                    assert.equal(firstErrorMessage(), 'Value is empty');
                });
        });
        it("breakIf", () => {
            const form = scalarConstraint()
                .breakIf(v.isEmpty())
                .addValidator(v.isNotEmpty(), 'Value is empty')
            ;

            return form.filter('')
                .then(({isValid, getValue, errorMessages, firstErrorMessage}) => {
                    assert.equal(isValid(), true);
                    assert.equal(getValue(), '');
                    assert.equal(errorMessages().length, 0);
                    assert.equal(firstErrorMessage(), null);
                });
        });
        it("valueIf", () => {
            const form = scalarConstraint()
                .valueIf(v.compare(0), 100)
                .addValidator(v.compare(100), 'Value is incorrect')
            ;

            return form.filter(0)
                .then(({isValid, getValue, errorMessages, firstErrorMessage}) => {
                    assert.equal(isValid(), true);
                    assert.equal(getValue(), 100);
                    assert.equal(errorMessages().length, 0);
                    assert.equal(firstErrorMessage(), null);
                });
        });
    });

});
