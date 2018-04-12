'use strict';

const _ = require('lodash');

const filterTransformer = function (transformer) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            transformer(_.cloneDeep(valueObj.value), constraint).then(function (transformedValue) {
                valueObj.value = transformedValue;
                resolve({constraint, valueObj});
            });
        });
    }
};

const filterValidator = function (validator, message, isFatal) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve, reject) {
            validator(valueObj.value, constraint).then(function (isCorrect) {
                if (isCorrect) {
                    resolve({constraint, valueObj});
                } else if (!isFatal) {
                    valueObj.errorMessages.push(message);
                    resolve({constraint, valueObj})
                } else {
                    valueObj.errorMessages.push(message);
                    reject({constraint, valueObj});
                }
            });
        });
    }
};

const filterBreakIf = function (validator, source) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve, reject) {
            const checkedValue = source === module.exports.SOURCE_CONSTRAINT ? constraint : valueObj.value;

            validator(checkedValue).then(function (isBreak) {
                if (isBreak) {
                    reject({constraint, valueObj});
                } else {
                    resolve({constraint, valueObj});
                }
            });
        });
    }
};

const filterValueIf = function (validator, value, source) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            const checkedValue = source === module.exports.SOURCE_CONSTRAINT ? constraint : valueObj.value;

            validator(checkedValue).then(function (isSuccess) {
                if (isSuccess) {
                    valueObj.value = value;
                }

                resolve({constraint, valueObj});
            });
        });
    }
};

const filterSaveValue = function (label) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            valueObj.values[label] = _.cloneDeep(valueObj.value);

            resolve({constraint, valueObj});
        });
    }
};

const filterRestoreValue = function (label) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            valueObj.value = _.cloneDeep(valueObj.values[label]);

            resolve({constraint, valueObj});
        });
    }
};

class ScalarConstraint {
    constructor() {
        this.filters = [];
        this.parent = null;
    }

    setParent(parent) {
        this.parent = parent;

        return this;
    }

    getParent() {
        return this.parent;
    }

    end() {
        return this.parent;
    }

    addValidator(validator, message, isFatal) {
        message = message || '';
        isFatal = isFatal || false;
        this.filters.push(filterValidator(validator, message, isFatal));

        return this;
    }

    addTransformer(transformer) {
        this.filters.push(filterTransformer(transformer));

        return this;
    }

    breakIf(validator, source) {
        source = source || module.exports.SOURCE_VALUE;
        this.filters.push(filterBreakIf(validator, source));

        return this;
    }

    valueIf(validator, value, source) {
        source = source || module.exports.SOURCE_VALUE;
        this.filters.push(filterValueIf(validator, value, source));

        return this;
    }

    saveValue(label) {
        this.filters.push(filterSaveValue(label));

        return this;
    }

    restoreValue(label) {
        this.filters.push(filterRestoreValue(label));

        return this;
    }

    filter(value) {
        const self = this;
        const valueObj = {
            value,
            values: {
                'before': _.cloneDeep(value),
            },
            errorMessages: [],
        };

        return new Promise(function (resolve) {
            const createResponse = function (valueObj) {
                const isValid = valueObj.errorMessages.length === 0;
                valueObj.values['after'] = valueObj.value;
                return {
                    isValid,
                    value: valueObj.value,
                    values: valueObj.values,
                    errorMessages: valueObj.errorMessages,
                    structuredErrorMessages: valueObj.errorMessages,
                    firstErrorMessage: isValid ? null : valueObj.errorMessages[0],
                };
            };

            const filters = _.cloneDeep(self.filters);

            if (filters.length > 0) {
                const promise = _.reduce(filters, function (promise, filter) {
                    return promise.then(filter)
                }, filters.shift()({
                    constraint: self,
                    valueObj
                }));
                promise
                    .then(function ({valueObj}) {
                        resolve(createResponse(valueObj))
                    })
                    .catch(function ({valueObj}) {
                        resolve(createResponse(valueObj))
                    })
                ;
            } else {
                resolve(createResponse(valueObj));
            }
        });
    }
}


module.exports = function () {
    return new ScalarConstraint();
};

module.exports.SOURCE_VALUE = 'value';
module.exports.SOURCE_CONSTRAINT = 'constraint';
module.exports.LABEL_BEFORE = 'before';
module.exports.LABEL_AFTER = 'after';
