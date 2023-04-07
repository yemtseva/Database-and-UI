var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_yemtseva',
  password        : '5036',
  database        : 'cs290_yemtseva'
});

module.exports.pool = pool;
