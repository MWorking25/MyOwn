var mysql = require('mysql');
var mysqlDump = require('mysqldump');

function Connection() {

  this.pool = mysql.createPool({
    connectionLimit: 100,
    multipleStatements: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  this.acquire = function (callback) {
    this.pool.getConnection(function (err, connection) {
      callback(err, connection);
    });
  };

  /* try
  {
    mysqlDump({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fd',
    dest:'www/files/ThreesaDataBaseBackup.sql' // destination file 
},function(err){
    // create data.sql file; 
})
  }
  catch(e)
  {
	  console.log(e)
  }
   */
}

module.exports = new Connection();