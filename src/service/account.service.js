import Models from '../database/sequelize';
const Account = Models.account;

class AccountService {
   async getAllAcount() {
      try {
         const accounts = await Account.findAll();
         return accounts;
      } catch (error) {
         console.log('🚀 ~ file: account.service.js ~ line 10 ~ AccountService ~ error', error);
         return null;
      }
   }
}

export default new AccountService();
