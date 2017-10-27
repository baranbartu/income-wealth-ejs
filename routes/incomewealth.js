var express = require('express');
var router = express.Router();

/* GET top10 income metrics. */
router.get('/top10', function(req, res, next) {
  var init = req.query.init;
  var end = req.query.end;
  connection.query(`SELECT income_top10, wealth_top10 from app_incomewealth WHERE year >= ${init} and year <= ${end}`,
    function(error, results, fields) {
      if (error) {
        res.send(JSON.stringify({
          "status": 500,
          "error": error,
          "response": null
        }));
        // If there is error, we send the error in the 
        // error section with 500 status
      } else {
        res.send(JSON.stringify({
          'data': results
        }));
        // If there is no error, all is good and response is 200OK.
      }
    });
});

module.exports = router;
