import pool from './connectDB';
import PasswordHandler from '../utils/passwordHandler';

class AuthenService {
   async login(userName, password) {
      console.log({ userName, password });
      const [rows] = await pool.execute(
         'select userName,password,permissioncode as role_code from account,role where userName = ? and account.role_id= role.id',
         [userName],
      );
      if (rows.length > 0) {
         let account = rows[0];
         return PasswordHandler.checkMatch(password, account.password) ? account : null;
      }
      return null;
   }
   async getAllRefreshTokens() {
      const [rows] = await pool.execute('select refreshToken from refresh_tokens');
      if (rows.length > 0) {
         const refreshTokens = rows.map((tokenObject) => tokenObject.refreshToken);
         return refreshTokens;
      }
      return null;
   }
   async insertRefreshTokens(refreshToken, userName) {
      try {
         const [{ affectedRows }, rows] = await pool.execute(
            'INSERT INTO refresh_tokens (refreshToken,userName) VALUES (?,?);',
            [refreshToken, userName],
         );
         return affectedRows > 0;
      } catch (error) {
         console.log('Insert data into refresh_tokens table occured error :', error);
         return false;
      }
   }
   async deleteRefreshTokensByUserName(userName) {
      try {
         const [{ affectedRows }, rows] = await pool.execute('DELETE FROM refresh_tokens WHERE userName = ?;', [
            userName,
         ]);
         return affectedRows > 0;
      } catch (error) {
         console.log('Delete refresh token occured error :', error);
         return false;
      }
   }
}
export default new AuthenService();
