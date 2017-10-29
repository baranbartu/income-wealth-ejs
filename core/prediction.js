var utils = require('./utils');

'use strict';

exports = module.exports;

/**
 * we have n pairs x and y in the same probability space and we have a function
 * like ax + b to describe best possibility line on the those points 
 * and we need best coefficients a and b. f(x) = y = ax + b
 * 
 * lets assume we already found the a and b. So error for each x can be defined
 * as y - f(x), where y is the real y that we already have from the matrix.
 * but we might have minus values and we need to minimize errors preventing
 * minus values, to be able do this, we can use |z| = √¯z2 from Calculus terms.
 *
 * to explicitly formalize the problem S(a, b) = ∑ x =1 to n, (yi - f(xi))²
 * and we need to calculate a derivative for both a and b and	equalize to 0.
 * max y can be 1.0 at most, thus our function concave and we need to equalize
 * derivative of function to zero to able to find the max.
 *
 * So, after simplify the two equality, 
 * we will two function to be able to get a and b. Demonstration of simplfy
 * will be difficult here(so much mathemathical terms) and will be shown only
 * result functions for a and b.
 *
 * b = yavg - a * xavg
 * a = ∑ x =1 to n, ((yi - yavg) * xi) / ((xi - xavg) * xi)
 */
exports.train = function(values, callback) {
  // [{year: 2010, metric: 0.4}, {year: 2011, metric:0.5}]
  // [[2010, 2011], [0.4, 0.5]]
  var groupedValues = utils.groupByValues(values);
  var years = groupedValues[0];
  var metrics = groupedValues[1];

  var xAvg = utils.avgArray(years);
  var yAvg = utils.avgArray(metrics);

  // [[2010, 2011], [0.4, 0.5]]
  // [[2010, 0.4], [2011, 0.5]]
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
