import pool from './connectDB';
import passwordHanler from '../utils/passwordHandler';

class AuthenService {
   async login(userName, password) {
      const result = await pool.execute('select userName,password from account where userName = ?', [userName]);
      console.log('🚀 ~ file: authen.service.js ~ line 8 ~ AuthenService ~ result', result);
   }
}
export default new AuthenService();
