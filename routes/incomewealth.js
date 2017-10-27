var express = require('express');
var router = express.Router();
var serializer = require('../core/serializers');
var utils = require('../core/utils');


/**
 * PS.(Baran) different function syntax from ecmascript 6 lambda/arrow
 * functions 
 */
incomeWealthCommonView = (req, res, sqlQueryTemplate) => {
  // serialize request and return query or and throw error 
  serializer.serializeGetRequest(req.query, function(error, query) {
    // if query does not require necessary things return bad request
    if (error) {
      res.send(JSON.stringify({
        "status": 400,
        "error": error,
      }));
    } else {
      var sqlQuery = utils.strFromTemplate(sqlQueryTemplate, query);
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
};

/* GET top10 income/wealth metrics. */
router.get('/top10', function(req, res, next) {
  sqlQueryTemplate = 'SELECT year, income_top10, wealth_top10 from app_incomewealth WHERE year >= {init} and year <= {end}'
  return incomeWealthCommonView(req, res, sqlQueryTemplate);
});

/* GET bottom50 income/wealth metrics. */
router.get('/bottom50', function(req, res, next) {
  var sqlQueryTemplate = 'SELECT year, income_bottom50, wealth_bottom50 from app_incomewealth WHERE year >= {init} and year <= {end}'
  return incomeWealthCommonView(req, res, sqlQueryTemplate);
});


module.exports = router;
