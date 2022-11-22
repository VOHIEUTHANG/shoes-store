import initModels from '../models/init-models';
import { Sequelize } from 'sequelize';
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;

const sequelize = new Sequelize(database, user, password, {
   host,
   dialect: 'mysql',
});

(async () => {
   try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
   } catch (error) {
      console.error('Unable to connect to the database:', error);
   }
})();

export default initModels(sequelize);
export { sequelize };
