var utils = require('./utils');

'use strict';


exports = module.exports;

/* validate and serialize params */
exports.serializeGetRequest = function(params, callback) {
  var init = params.init;
  var end = params.end;

  if (init === 'undefined' || end === 'undefined') {
    return callback('"init" and "end" should be provided!', undefined);
  }

  if (!(utils.isInt(init) && utils.isInt(end))) {
    return callback('Should be provided proper integer of "init" and "end"', undefined);
  }

  return callback(undefined, {
    init: params.init,
    end: params.end
  });

};

exports.serializePredictRequest = function(body, type, callback) {
  var group = body.group;
  var years = body.years;

  if (group === 'undefined' || years === 'undefined') {
    return callback('"init" and "end" should be provided!', undefined);
  }

  if (!(utils.isInt(group) && [10, 50].indexOf(group) > -1 && utils.isInt(years))) {
    return callback('Should be provided proper integer of "group" and "years"', undefined);
  }

  var group_verbose = group == 50 ? 'bottom' : 'top';

  var columnTemplate = '{type}_{group_verbose}{group}'
  var column = utils.strFromTemplate(columnTemplate, {
    type: type,
    group_verbose: group_verbose,
    group: group
  });

  var sqlTemplate = 'SELECT year, {column} FROM app_incomewealth WHERE year <= 2014;';
  var sql = utils.strFromTemplate(sqlTemplate, {
    column: column
  });

  return callback(undefined, {
    sqlForTrainingData: sql,
    years: years,
    group: group
  });
};
