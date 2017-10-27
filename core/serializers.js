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
