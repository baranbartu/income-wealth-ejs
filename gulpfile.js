var gulp = require('gulp');
var mysql = require('mysql');


var dbConfig = {
  host: 'localhost',
  rootUsername: 'root',
  dbName: 'incomewealth',
  dbUser: 'incomewealth',
  dbPassword: '8e5HLr7gWas='
};

var rootConnection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.rootUsername
});

gulp.task('initializedb', function() {
  rootConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    rootConnection.query("CREATE DATABASE IF NOT EXISTS incomewealth", function(err, result) {
      if (err) throw err;
      console.log("Database created || already exists.");
      // create user and grant access
      gulp.start('createUserAndGrantAccess');
    });
  });
});

gulp.task('createUserAndGrantAccess', function() {

});

gulp.task('default', ['initializedb']);
