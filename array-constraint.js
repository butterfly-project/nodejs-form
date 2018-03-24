'use strict';

const _ = require('lodash');
const scalarConstraint = require('./scalar-constraint');

const filterTransformer = transformer => ({constraint, valueObj}) => {
    return new Promise(resolve => {
        transformer(_.cloneDeep(valueObj.value)).then(transformedValue => {
            valueObj.value = transformedValue;
            resolve({constraint, valueObj});
        });
    });
};

const filterValidator = (validator, message, isFatal) => ({constraint, valueObj}) => {
    return new Promise((resolve, reject) => {
        validator(valueObj.value).then(isCorrect => {
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

class FilterResult {
    constructor(keyResults) {
        this.keys = _.keys(keyResults);

        _.map(this.keys, key => {
            this[key] = keyResults[key];
        });
    }

    getValue(label = 'after') {
        const result = {};

        _.map(this.keys, key => {
            result[key] = this[key].values[label];
        });

        return result;
    }

    get isValid() {
        return _.reduce(_.map(this.keys, key => this[key].isValid), (sum, isValid) => sum && isValid, true);
    }

    get errorMessages() {
        return _.reduce(_.map(this.keys, key => this[key].errorMessages), (sum, messages) => _.concat(sum, messages), []);
    }

    get structuredErrorMessages() {
        const result = {};

        _.map(this.keys, key => {
            result[key] = this[key].structuredErrorMessages;
        });

        return result;
    }

    get firstErrorMessage() {
        let errorMessage = '';

        _.forEach(this.keys, key => {
            if (this[key].errorMessages.length > 0) {
                errorMessage = this[key].errorMessages[0];
                return false;
            }
        });

        return errorMessage;
    }

}

class ArrayConstraint {
    constructor() {
        this.constraints = {};
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

    addScalarConstraint(key) {
        return this.addConstraint(key, scalarConstraint());
    }

    addArrayConstraint(key) {
        return this.addConstraint(key, new ArrayConstraint());
    }

    addConstraint(key, constraint) {
        this.constraints[key] = constraint;
        constraint.setParent(this);

        return constraint;
    }

    removeConstraint(key) {
        if (undefined !== this.constraints[key]) {
            this.constraints[key].setParent(null);
            delete this.constraints[key];
        }
    }

    get(key) {
        return this.constraints[key] || null;
    }

    filter(value) {
        if (!_.isObject(value)) {
            const toType = obj => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            throw Error('Expected object, given ' + toType(value));
        }

        const map = {};
        const promises = _.map(_.keys(this.constraints), (key, index) => {
            map[index] = key;
            return this.constraints[key].filter(value[key]);
        });

        return new Promise(resolve => {
            Promise.all(promises).then(rawKeyResults => {
                const keyResults = {};
                _.map(rawKeyResults, (result, index) => {
                    keyResults[map[index]] = result;
                });

                resolve(new FilterResult(keyResults));
            });
        });
    }
}


module.exports = () => {
    return new ArrayConstraint();
};
