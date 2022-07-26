import bcrypt from 'bcrypt';

class PasswordHandler {
   saltRounds = 10;
   getHashPassword(password) {
      return bcrypt.hashSync(password, this.saltRounds);
   }
   checkMatch(password, hash) {
      return bcrypt.compareSync(password, hash);
   }
}

export default new PasswordHandler();
