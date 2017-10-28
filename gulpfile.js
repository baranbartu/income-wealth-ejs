var gulp = require('gulp');
var mysql = require('mysql');
var utils = require('./core/utils');
var csv = require("fast-csv");


var config = {
  host: 'localhost',
  rootUsername: 'root',
  dbName: 'incomewealth',
  dbUser: 'incomewealth',
  dbPassword: '8e5HLr7gWas=',
  csvPath: 'data/wealthincomeus.csv'
};

var rootConnection = mysql.createConnection({
  host: config.host,
  user: config.rootUsername
});

gulp.task('initializedb', function() {
  rootConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sqlTemplate = 'CREATE DATABASE IF NOT EXISTS {dbName} CHARACTER SET utf8;';
    var sql = utils.strFromTemplate(sqlTemplate, {
      dbName: config.dbName
    });
    rootConnection.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Database created || already exists.");
      // create user and grant access
      gulp.start('createUser');
    });
  });
});

gulp.task('createUser', function() {
  var sqlTemplate = "CREATE USER IF NOT EXISTS '{dbUser}'@'{host}' IDENTIFIED BY '{dbPassword}';";
  var sql = utils.strFromTemplate(sqlTemplate, {
    dbUser: config.dbUser,
    host: config.host,
    dbPassword: config.dbPassword
  });
  rootConnection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("User created || already exists.");
    gulp.start('grantAccess');
  });
});

gulp.task('grantAccess', function() {
  var sqlTemplate = "GRANT ALL PRIVILEGES ON {dbName}.* TO '{dbUser}'@'%' IDENTIFIED BY '{dbPassword}' WITH GRANT OPTION;";
  var sql = utils.strFromTemplate(sqlTemplate, {
    dbUser: config.dbUser,
    dbName: config.dbName,
    dbPassword: config.dbPassword
  });
  rootConnection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Grant access done.");
    gulp.start('createTable');
  });
});

gulp.task('createTable', function() {
  var connection = mysql.createConnection({
    host: config.host,
    user: config.dbUser,
    database: config.dbName,
    password: config.dbPassword
  });

  var sql = "CREATE TABLE IF NOT EXISTS `app_incomewealth` ( `id` int(11) NOT NULL AUTO_INCREMENT, `year` int(11) NOT NULL, `income_top10` double NOT NULL, `wealth_top10` double NOT NULL, `income_bottom50` double NOT NULL, `wealth_bottom50` double NOT NULL, PRIMARY KEY(`id`), UNIQUE KEY `year` (`year`)) ENGINE = InnoDB AUTO_INCREMENT = 107 DEFAULT CHARSET = utf8;"; 

  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Create table done.");
    gulp.start('loadDataFromCsv');
  });
});

gulp.task('loadDataFromCsv', function() {
  var connection = mysql.createConnection({
    host: config.host,
    user: config.dbUser,
    database: config.dbName,
    password: config.dbPassword
  });

  csv.fromPath(config.csvPath)
    .on("data", function(data) {
      data.forEach(function(val) {
        // first row contains column names
        if (val.indexOf('year') == -1) {
          var values = val.split(';');
          var mapping = {
            'year': values[0],
            'income_top10': values[1],
            'wealth_top10': values[2],
            'income_bottom50': values[3],
            'wealth_bottom50': values[4]
          }

          var sqlTemplate = 'INSERT INTO app_incomewealth (year, income_top10, wealth_top10, income_bottom50, wealth_bottom50) VALUES({year}, {income_top10}, {wealth_top10}, {income_bottom50}, {wealth_bottom50}) ON DUPLICATE KEY UPDATE year=VALUES(year)';
          var sql = utils.strFromTemplate(sqlTemplate, mapping);
          console.log(sql);

          connection.query(sql, function(err, result) {
            if (err) throw err;
            console.log("Row created/updated.");
          });
        }
      });
    })
    .on("end", function() {
      console.log("csv parsing and import db done");
    });
});

gulp.task('default', ['initializedb']);
