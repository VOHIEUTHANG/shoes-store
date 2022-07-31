import * as mysqlInfo from '../constants';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(mysqlInfo.database, mysqlInfo.user, mysqlInfo.password, {
   host: 'localhost',
   dialect: 'mysql',
});

try {
   await sequelize.authenticate();
   console.log('Connection has been established successfully.');
} catch (error) {
   console.error('Unable to connect to the database:', error);
}

export default sequelize;
