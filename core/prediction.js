var utils = require('./utils');

'use strict';

exports = module.exports;

exports.train = function(values, callback) {
  var groupedValues = utils.groupByValues(values);
  var years = groupedValues[0];
  var metrics = groupedValues[1];

  var xAvg = utils.avgArray(years);
  var yAvg = utils.avgArray(metrics);

  var matrix = utils.makeMatrixByGroupedValues(groupedValues);

  var aNum = aDenom = 0.0;
  matrix.forEach(function(pair) {
    // x = year, y = metric
    var x = pair[0];
    var y = pair[1];
    aNum += (y - yAvg) * x;
    aDenom += (x - xAvg) * x
  });

  var a = parseFloat(aNum) / parseFloat(aDenom);
  var b = yAvg - a * xAvg;

  return callback(a, b);
};
