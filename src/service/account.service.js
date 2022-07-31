import Models from '../database/sequelize';
const Account = Models.account;

class AccountService {
   async getAllAcount() {
      const accounts = await Account.findAll();
      console.log('🚀 ~ file: account.service.js ~ line 6 ~ AccountService ~ accounts', accounts);
      return accounts;
   }
}

export default new AccountService();
