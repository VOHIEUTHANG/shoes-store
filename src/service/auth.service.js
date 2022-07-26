import pool from './connectDB';
import PasswordHandler from '../utils/passwordHandler';

class AuthenService {
   async login(userName, password) {
      console.log({ userName, password });
      const [rows] = await pool.execute('select userName,password,permissioncode as role_code from account,role where userName = ? and account.role_id= role.id', [userName]);
      if (rows.length > 0) {
         let account  = rows[0];
         if (PasswordHandler.checkMatch(password,account.password))
          return account;
      else return false;
      }
      return undefined;
   }
}
export default new AuthenService();
