'use strict';

const defineTest = require('./../utils/testwrap');
const v = require('./../validator');
const t = require('./../transformer');
const arrayConstraint = require('./../array-constraint');

defineTest(({describe, it, assert}) => {
    const form = arrayConstraint()
        .addScalarConstraint('username')
        .addTransformer(t.trim())
        .addValidator(v.isNotEmpty(), 'Username field is required')
        .end()
        .addScalarConstraint('password')
        .addTransformer(t.trim())
        .addValidator(v.isNotEmpty(), 'Password field is required')
        .end()
    ;

    describe("arrayConstraint", () => {
        it("standart", () => {
            return form.filter({username: ' a ', password: 'b'})
                .then(result => {
                    assert.equal(result.isValid, true);
                    assert.deepEqual(result.getValue('before'), {username: ' a ', password: 'b'});
                    assert.deepEqual(result.getValue('after'), {username: 'a', password: 'b'});
                });
        });

        it("errorMessages", () => {
            return form.filter({username: ' ', password: ' '})
                .then(result => {
                    assert.equal(result.isValid, false);
                    assert.equal(result.errorMessages.length, 2);
                    assert.equal(result.username.isValid, false);
                    assert.equal(result.username.errorMessages.length, 1);
                    assert.equal(result.structuredErrorMessages.username.length, 1);
                    assert.equal(result.structuredErrorMessages.password.length, 1);
                    assert.equal(result.firstErrorMessage !== null, true);
                });
        });

    });

});
