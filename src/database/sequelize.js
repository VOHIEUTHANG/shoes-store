import initModels from '../models/init-models';
import * as mysqlInfo from '../constants/index';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(mysqlInfo.database, mysqlInfo.user, mysqlInfo.password, {
   host: 'localhost',
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
