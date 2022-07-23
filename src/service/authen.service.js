const {query,connect}= require('./connectSql.service');
const bcrypt = require('bcrypt');
class AuthenService {
   async Login(user,pass){
       let saltRounds = 10;
       let check = await query(`call checkLogin('${user}')`);
       let match = await bcrypt.compare(pass,check[0][0].matkhau);
       if(match)
       {
         let data = await query(`call getAccount('${user}')`);
         return data[0][0];
       }
       else return 'Sai tên đăng nhập hoặc mật khẩu';
    }
}
module.exports= new AuthenService;
