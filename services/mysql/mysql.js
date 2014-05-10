var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : process.evn.OPENSHIFT_MYSQL_DB_HOST,
  port     : process.evn.OPENSHIFT_MYSQL_DB_PORT,
  user     : 'adminYhHZSIl',
  password : '9xLLxLqHiXqS',
});

connection.connect(function(err) {
  // connected! (unless `err` is set)
});

module.exports = connection;
