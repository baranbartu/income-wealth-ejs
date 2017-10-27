var _collection = require('lodash/collection');
var _object = require('lodash/object');
var _array = require('lodash/array');

'use strict';

exports = module.exports;


exports.isInt = function(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
};

exports.flattenizeListOfObjects = function(values) {
  return _object.mapValues(values[0], function(value, key) {
    return _collection.map(values, key);
  });
};

var commonStructureMapping = {
  income_top10: 'income',
  income_bottom50: 'income',
  wealth_top10: 'wealth',
  wealth_bottom50: 'wealth',
  year: 'period'
};

exports.commonViewStructure = function(obj) {
  return _array.fromPairs(_collection.map(obj, function(value, key) {
    return [commonStructureMapping[key] || key, value];
  }));
};
