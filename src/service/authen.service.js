import pool from './connectDB';
import passwordHanler from '../utils/passwordHandler';

class AuthenService {
   async login(userName, password) {
      console.log({ userName, password });
      const [rows] = await pool.execute('select userName,password from account where userName = ?', [userName]);
      if (rows.length > 0) {
         const { hashPassword } = rows[0];
         return hashPassword;
      }
      return undefined;
   }
}
export default new AuthenService();
