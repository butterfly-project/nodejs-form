'use strict';

const _ = require('lodash');

const filterTransformer = transformer => ({constraint, valueObj}) => {
    return new Promise(resolve => {
        transformer(_.cloneDeep(valueObj.value), constraint).then(transformedValue => {
            valueObj.value = transformedValue;
            resolve({constraint, valueObj});
        });
    });
};

const filterValidator = (validator, message, isFatal) => ({constraint, valueObj}) => {
    return new Promise((resolve, reject) => {
        validator(valueObj.value, constraint).then(isCorrect => {
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
};

const filterBreakIf = (validator, source) => ({constraint, valueObj}) => {
    return new Promise((resolve, reject) => {
        const checkedValue = source === module.exports.SOURCE_CONSTRAINT ? constraint : valueObj.value;

        validator(checkedValue).then(isBreak => {
            if (isBreak) {
                reject({constraint, valueObj});
            } else {
                resolve({constraint, valueObj});
            }
        });
    });
};

const filterSaveValue = label => ({constraint, valueObj}) => {
    return new Promise(resolve => {
        valueObj.values[label] = _.cloneDeep(valueObj.value);

        resolve({constraint, valueObj});
    });
};

const filterRestoreValue = label => ({constraint, valueObj}) => {
    return new Promise(resolve => {
        valueObj.value = _.cloneDeep(valueObj.values[label]);

        resolve({constraint, valueObj});
    });
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

    addValidator(validator, message = '', isFatal = false) {
        this.filters.push(filterValidator(validator, message, isFatal));

        return this;
    }

    addTransformer(transformer) {
        this.filters.push(filterTransformer(transformer));

        return this;
    }

    breakIf(validator, source = module.exports.SOURCE_VALUE) {
        this.filters.push(filterBreakIf(validator, source));

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
        const valueObj = {
            value,
            values: {
                'before': _.cloneDeep(value),
            },
            errorMessages: [],
        };

        return new Promise(resolve => {
            const createResponse = valueObj => {
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

            const filters = _.cloneDeep(this.filters);

            if (filters.length > 0) {
                const promise = _.reduce(filters, (promise, filter) => promise.then(filter), filters.shift()({constraint: this, valueObj}));
                promise
                    .then(({valueObj}) => resolve(createResponse(valueObj)))
                    .catch(({valueObj}) => resolve(createResponse(valueObj)))
                ;
            } else {
                resolve(createResponse(valueObj));
            }
        });
    }
}


module.exports = () => {
    return new ScalarConstraint();
};

module.exports.SOURCE_VALUE = 'value';
module.exports.SOURCE_CONSTRAINT = 'constraint';
module.exports.LABEL_BEFORE = 'before';
module.exports.LABEL_AFTER = 'after';
