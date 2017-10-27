var express = require('express');
var router = express.Router();
var serializer = require('../core/serializers');
var utils = require('../core/utils');

/* GET top10 income/wealth metrics. */
router.get('/top10', function(req, res, next) {
  // serialize request and return query or and throw error 
  serializer.serializeGetRequest(req.query, function(error, query) {
    // if query does not require necessary things return bad request
    if (error) {
      res.send(JSON.stringify({
        "status": 400,
        "error": error,
      }));
    } else {
      var init = query.init;
      var end = query.end;
      var sqlQuery = `SELECT year, income_top10, wealth_top10 from app_incomewealth WHERE year >= ${init} and year <= ${end}`
      connection.query(sqlQuery, function(error, results, fields) {
        if (error) {
          // If there is error, we send the error in the 
          // error section with 500 status
          res.send(JSON.stringify({
            "status": 500,
            "error": error
          }));
        } else {
          // If there is no error, all is good and response is 200OK.
          var flattenizeObject = utils.flattenizeListOfObjects(results);
          res.send(JSON.stringify({
            'data': utils.commonViewStructure(flattenizeObject)
          }));
        }
      });
    }
  });
});

module.exports = router;
