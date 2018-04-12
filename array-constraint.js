'use strict';

const _ = require('lodash');
const scalarConstraint = require('./scalar-constraint');

const filterTransformer = function (transformer) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            transformer(_.cloneDeep(valueObj.value)).then(function (transformedValue) {
                valueObj.value = transformedValue;
                resolve({constraint, valueObj});
            });
        });
    }
};

const filterValidator = function (validator, message, isFatal) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve, reject) {
            validator(valueObj.value).then(function (isCorrect) {
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

class FilterResult {
    constructor(keyResults) {
        this.keys = _.keys(keyResults);
        const self = this;

        _.map(this.keys, function (key) {
            self[key] = keyResults[key];
        });
    }

    getValue(label = 'after') {
        const result = {};
        const self = this;

        _.map(this.keys, function (key) {
            result[key] = self[key].values[label];
        });

        return result;
    }

    get isValid() {
        const self = this;
        return _.reduce(_.map(this.keys, function (key) {
            return self[key].isValid;
        }), function (sum, isValid) {
            return sum && isValid;
        }, true);
    }

    get errorMessages() {
        const self = this;
        return _.reduce(_.map(this.keys, function (key) {
            return self[key].errorMessages;
        }), function (sum, messages) {
            return _.concat(sum, messages);
        }, []);
    }

    get structuredErrorMessages() {
        const self = this;
        const result = {};

        _.map(this.keys, function (key) {
            result[key] = self[key].structuredErrorMessages;
        });

        return result;
    }

    get firstErrorMessage() {
        let errorMessage = '';
        const self = this;

        _.forEach(this.keys, function (key) {
            if (self[key].errorMessages.length > 0) {
                errorMessage = self[key].errorMessages[0];
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
        this.tempResult = {};
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
        const self = this;
        if (!_.isObject(value)) {
            const toType = function (obj) {
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            };
            throw Error('Expected object, given ' + toType(value));
        }

        return new Promise(function(resolve) {
            const keys = _.keys(self.constraints);

            if (keys.length > 0) {
                let currentKey = keys.shift();
                let promise = self.constraints[currentKey].filter(value[currentKey]);
                _.map(keys, function(key) {
                    promise = promise.then(function(constraintResult) {
                        self.tempResult[currentKey] = constraintResult;

                        currentKey = key;

                        return self.constraints[currentKey].filter(value[currentKey]);
                    });
                });

                promise.then(function(constraintResult) {
                    self.tempResult[currentKey] = constraintResult;

                    resolve(new FilterResult(_.cloneDeep(self.tempResult)));
                    self.tempResult = {};
                });
            }
        });
    }
}


module.exports = function() {
    return new ArrayConstraint();
};
