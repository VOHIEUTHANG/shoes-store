import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as mysqlInfo from '../constants';
dotenv.config();

const pool = mysql.createPool({
   host: mysqlInfo.host,
   user: mysqlInfo.user,
   database: mysqlInfo.database,
   password: mysqlInfo.password,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

pool.getConnection((err) => {
   if (err) throw err;
   console.log('Connect database successfully!');
});

export default pool;
