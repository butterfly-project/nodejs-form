'use strict';

var _ = require('lodash');
var scalarConstraint = require('./scalar-constraint');

var filterTransformer = function (transformer) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            transformer(_.cloneDeep(valueObj.value)).then(function (transformedValue) {
                valueObj.value = transformedValue;
                resolve({constraint, valueObj});
            });
        });
    }
};

var filterValidator = function (validator, message, isFatal) {
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

var filterBreakIf = function (validator, source) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve, reject) {
            var checkedValue = source === module.exports.SOURCE_CONSTRAINT ? constraint : valueObj.value;

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

var filterSaveValue = function (label) {
    return function ({constraint, valueObj}) {
        return new Promise(function (resolve) {
            valueObj.values[label] = _.cloneDeep(valueObj.value);

            resolve({constraint, valueObj});
        });
    }
};

var filterRestoreValue = function (label) {
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
        var self = this;

        _.map(this.keys, function (key) {
            self[key] = keyResults[key];
        });
    }

    getValue(label = 'after') {
        var result = {};
        var self = this;

        _.map(this.keys, function (key) {
            result[key] = self[key].values[label];
        });

        return result;
    }

    get isValid() {
        var self = this;
        return _.reduce(_.map(this.keys, function (key) {
            return self[key].isValid;
        }), function (sum, isValid) {
            return sum && isValid;
        }, true);
    }

    get errorMessages() {
        var self = this;
        return _.reduce(_.map(this.keys, function (key) {
            return self[key].errorMessages;
        }), function (sum, messages) {
            return _.concat(sum, messages);
        }, []);
    }

    get structuredErrorMessages() {
        var self = this;
        var result = {};

        _.map(this.keys, function (key) {
            result[key] = self[key].structuredErrorMessages;
        });

        return result;
    }

    get firstErrorMessage() {
        var errorMessage = '';
        var self = this;

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
        var self = this;
        if (!_.isObject(value)) {
            var toType = function (obj) {
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            };
            throw Error('Expected object, given ' + toType(value));
        }

        return new Promise(function(resolve) {
            var keys = _.keys(self.constraints);

            if (keys.length > 0) {
                var currentKey = keys.shift();
                var promise = self.constraints[currentKey].filter(value[currentKey]);
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
