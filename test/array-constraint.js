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

    describe("arrayConstraint 2", () => {
        const findUserByUsername = username => {
            return new Promise(resolve => {
                if (username.length === 4) {
                    resolve({id: 1, username, password: 'abc'});
                } else {
                    resolve(null);
                }
            });
        };

        const checkPassword = (password, passwordConstraint) => {
            return new Promise(resolve => {
                const userResult = passwordConstraint.getParent().tempResult.user;

                if (!userResult.isValid) {
                    resolve(false);
                    return;
                }

                const user = userResult.value;
                const isCorrect = user.password === password;

                resolve(isCorrect);
            })
        };

        const realForm = arrayConstraint()
            .addScalarConstraint('user')
                .addTransformer(t.trim())
                .addTransformer(findUserByUsername)
                .addValidator(v.isNotEmpty(), 'Undefined user')
            .end()
            .addScalarConstraint('password')
                .addTransformer(t.trim())
                .addValidator(checkPassword, 'Incorrect password')
            .end()
        ;

        it("realform", () => {
            return realForm.filter({user: 'user', password: 'abc'})
                .then(result => {
                    assert.equal(result.isValid, true);
                });
        });

        it("realform undefined user", () => {
            return realForm.filter({user: 'u', password: 'abc'})
                .then(result => {
                    assert.equal(result.firstErrorMessage, 'Undefined user');
                });
        });

        it("realform incorrect password", () => {
            return realForm.filter({user: 'user', password: 'abc1'})
                .then(result => {
                    assert.equal(result.firstErrorMessage, 'Incorrect password');
                });
        });
    });
});
