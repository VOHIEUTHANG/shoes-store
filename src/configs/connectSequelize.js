import * as mysqlInfo from '../constants';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(mysqlInfo.database, mysqlInfo.user, mysqlInfo.password, {
   host: 'localhost',
   dialect: 'mysql',
});
    sequelize.authenticate().then(()=> {console.log('Connection has been established successfully.');})
.catch((err)=>{
   console.log(err)
})
module.exports= sequelize;
