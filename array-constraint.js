'use strict';

var _ = require('lodash');
var scalarConstraint = require('./scalar-constraint');

function FilterResult(keyResults) {
    this.keys = _.keys(keyResults);
    var self = this;

    _.map(this.keys, function (key) {
        self[key] = keyResults[key];
    });
}

FilterResult.prototype.getValue = function(label) {
    label = label || 'after';

    var result = {};
    var self = this;

    _.map(this.keys, function (key) {
        result[key] = self[key].getValue(label);
    });

    return result;
};
FilterResult.prototype.getValue = function(label) {
    label = label || 'after';

    var result = {};
    var self = this;

    _.map(this.keys, function (key) {
        result[key] = self[key].getValue(label);
    });

    return result;
};
FilterResult.prototype.isValid = function() {
    var self = this;
    return _.reduce(_.map(this.keys, function (key) {
        return self[key].isValid();
    }), function (sum, isValid) {
        return sum && isValid;
    }, true);
};
FilterResult.prototype.errorMessages = function() {
    var self = this;
    return _.reduce(_.map(this.keys, function (key) {
        return self[key].errorMessages();
    }), function (sum, messages) {
        return _.concat(sum, messages);
    }, []);
};
FilterResult.prototype.structuredErrorMessages = function() {
    var self = this;
    var result = {};

    _.map(this.keys, function (key) {
        result[key] = self[key].structuredErrorMessages();
    });

    return result;
};
FilterResult.prototype.firstErrorMessage = function() {
    var errorMessage = '';
    var self = this;

    _.forEach(this.keys, function (key) {
        if (self[key].errorMessages().length > 0) {
            errorMessage = self[key].errorMessages()[0];
            return false;
        }
    });

    return errorMessage;
};

function ArrayConstraint() {
    this.constraints = {};
    this.parent = null;
    this.tempResult = {};
}

ArrayConstraint.prototype.setParent = function (parent) {
    this.parent = parent;

    return this;
};
ArrayConstraint.prototype.getParent = function() {
    return this.parent;
};
ArrayConstraint.prototype.end = function() {
    return this.parent;
};
ArrayConstraint.prototype.addScalarConstraint = function(key) {
    return this.addConstraint(key, scalarConstraint());
};
ArrayConstraint.prototype.addArrayConstraint = function(key) {
    return this.addConstraint(key, new ArrayConstraint());
};
ArrayConstraint.prototype.addConstraint = function(key, constraint) {
    this.constraints[key] = constraint;
    constraint.setParent(this);

    return constraint;
};
ArrayConstraint.prototype.removeConstraint = function(key) {
    if (undefined !== this.constraints[key]) {
        this.constraints[key].setParent(null);
        delete this.constraints[key];
    }
};
ArrayConstraint.prototype.get = function(key) {
    return this.constraints[key] || null;
};
ArrayConstraint.prototype.filter = function(value) {
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
};

module.exports = function() {
    return new ArrayConstraint();
};
