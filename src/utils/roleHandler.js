import pool from '../service/connectDB';
class roleHandler {
   async getRole(role_code) {
      let [role] = await pool.execute('select rolename from role where permissioncode=?', [role_code]);
      return role[0] ? role : null;
   }

   async getAllRole() {
      let [role] = await pool.execute('select rolename from role');
      return role[0] ? role : null;
   }
}
module.exports = new roleHandler();
