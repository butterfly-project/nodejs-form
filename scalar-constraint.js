'use strict';

var _ = require('lodash');

var filterTransformer = function (transformer) {
    return function (params) {
        var constraint = params.constraint;
        var valueObj = params.valueObj;

        return new Promise(function (resolve) {
            transformer(_.cloneDeep(valueObj.value), constraint).then(function (transformedValue) {
                valueObj.value = transformedValue;
                resolve(params);
            });
        });
    }
};

var filterValidator = function (validator, message, isFatal) {
    return function (params) {
        var constraint = params.constraint;
        var valueObj = params.valueObj;

        return new Promise(function (resolve, reject) {
            validator(valueObj.value, constraint)
                .then(function (isCorrect) {
                    if (isCorrect) {
                        resolve(params);
                    } else if (!isFatal) {
                        valueObj.errorMessages.push(message);
                        resolve(params)
                    } else {
                        valueObj.errorMessages.push(message);
                        reject(params);
                    }
                })
                .catch(function (error) {
                    var message = error.message || error;
                    var parameters = error.data || {};

                    _.map(_.keys(parameters), parameter => {
                        message = message.replace('%' + parameter + '%', parameters[parameter]);
                    })

                    valueObj.errorMessages.push(message);
                    reject(params);
                })
        });
    }
};

var filterBreakIf = function (validator, source) {
    return function (params) {
        var constraint = params.constraint;
        var valueObj = params.valueObj;

        return new Promise(function (resolve, reject) {
            var checkedValue = source === module.exports.SOURCE_CONSTRAINT ? constraint : valueObj.value;

            validator(checkedValue).then(function (isBreak) {
                if (isBreak) {
                    reject(params);
                } else {
                    resolve(params);
                }
            });
        });
    }
};

var filterValueIf = function (validator, value, source) {
    return function (params) {
        var constraint = params.constraint;
        var valueObj = params.valueObj;

        return new Promise(function (resolve) {
            var checkedValue = source === module.exports.SOURCE_CONSTRAINT ? constraint : valueObj.value;

            validator(checkedValue).then(function (isSuccess) {
                if (isSuccess) {
                    valueObj.value = value;
                }

                resolve(params);
            });
        });
    }
};

var filterSaveValue = function (label) {
    return function (params) {
        var constraint = params.constraint;
        var valueObj = params.valueObj;

        return new Promise(function (resolve) {
            valueObj.values[label] = _.cloneDeep(valueObj.value);

            resolve(params);
        });
    }
};

var filterRestoreValue = function (label) {
    return function (params) {
        var constraint = params.constraint;
        var valueObj = params.valueObj;

        return new Promise(function (resolve) {
            valueObj.value = _.cloneDeep(valueObj.values[label]);

            resolve(params);
        });
    }
};

function ScalarConstraint() {
    this.filters = [];
    this.parent = null;
}

ScalarConstraint.prototype.setParent = function(parent) {
    this.parent = parent;

    return this;
}
ScalarConstraint.prototype.getParent = function() {
    return this.parent;
}
ScalarConstraint.prototype.end = function() {
    return this.parent;
}
ScalarConstraint.prototype.addValidator = function(validator, message, isFatal) {
    message = message || '';
    isFatal = isFatal || false;
    this.filters.push(filterValidator(validator, message, isFatal));

    return this;
}
ScalarConstraint.prototype.addTransformer = function(transformer) {
    this.filters.push(filterTransformer(transformer));

    return this;
}
ScalarConstraint.prototype.breakIf = function(validator, source) {
    source = source || module.exports.SOURCE_VALUE;
    this.filters.push(filterBreakIf(validator, source));

    return this;
}
ScalarConstraint.prototype.valueIf = function(validator, value, source) {
    source = source || module.exports.SOURCE_VALUE;
    this.filters.push(filterValueIf(validator, value, source));

    return this;
}
ScalarConstraint.prototype.saveValue = function(label) {
    this.filters.push(filterSaveValue(label));

    return this;
}
ScalarConstraint.prototype.restoreValue = function(label) {
    this.filters.push(filterRestoreValue(label));

    return this;
}
ScalarConstraint.prototype.filter = function(value) {
    var self = this;
    var valueObj = {
        value: value,
        values: {
            'before': _.cloneDeep(value),
        },
        errorMessages: [],
    };

    return new Promise(function (resolve) {
        var createResponse = function (valueObj) {
            var isValid = valueObj.errorMessages.length === 0;
            valueObj.values['after'] = valueObj.value;

            return {
                isValid: function () {
                    return isValid;
                },
                getValue: function (label) {
                    label = label || 'after';

                    return valueObj.values[label]
                },
                errorMessages: function () {
                    return valueObj.errorMessages;
                },
                structuredErrorMessages: function () {
                    return valueObj.errorMessages;
                },
                firstErrorMessage: function () {
                    return isValid ? null : valueObj.errorMessages[0];
                },
            };
        };

        var filters = _.cloneDeep(self.filters);

        if (filters.length > 0) {
            var promise = _.reduce(filters, function (promise, filter) {
                return promise.then(filter)
            }, filters.shift()({
                constraint: self,
                valueObj: valueObj,
            }));
            promise
                .then(function (params) {
                    var valueObj = params.valueObj;

                    resolve(createResponse(valueObj))
                })
                .catch(function (params) {
                    var valueObj = params.valueObj;

                    resolve(createResponse(valueObj))
                })
            ;
        } else {
            resolve(createResponse(valueObj));
        }
    });
}

module.exports = function () {
    return new ScalarConstraint();
};

module.exports.SOURCE_VALUE = 'value';
module.exports.SOURCE_CONSTRAINT = 'constraint';
module.exports.LABEL_BEFORE = 'before';
module.exports.LABEL_AFTER = 'after';
