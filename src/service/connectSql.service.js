import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
   host: process.env.HostDB,
   user: process.env.userDB,
   database: process.env.database,
   password: process.env.passwordDB,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

pool.getConnection((err) => {
   if (err) throw err;
   console.log('Connected!');
});

export default pool;
