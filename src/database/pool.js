import mysql from 'mysql2/promise';
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;

const pool = mysql.createPool({
   host,
   user,
   database,
   password,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

pool.getConnection((err) => {
   if (err) throw err;
   console.log('Connect database successfully!');
});

export default pool;
