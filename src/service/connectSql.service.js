const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
var con = mysql.createPool({
    host: process.env.HostDB,
    user: process.env.userDB,
    password: process.env.passwordDB,
    database: process.env.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
function query(sql){
  return new Promise((resolve,reject)=>{
   con.query(sql,(err,result)=>{
    if(err) reject(err);
    resolve(result);
   })
})
}
module.exports = {
  query,
  con
};