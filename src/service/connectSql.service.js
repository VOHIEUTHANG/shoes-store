const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
var con = mysql.createConnection({
    host: process.env.HostDB,
    user: process.env.userDB,
    password: process.env.passwordDB,
    database: process.env.database
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