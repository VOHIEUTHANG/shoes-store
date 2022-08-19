import Models from '../database/sequelize';
const roleModel = Models.role;
class roleService{
    async getRole(code){
      try {
        let role= await  roleModel.findOne({
            attributes:['roleName'],
            where:{
                permissionCode:code
            }
        });
        return role.dataValues.roleName;
      } catch (error) {
        console.log('🚀 ~ file: role.service.js ~ line 10 ~ roleService ~ error');
         return null;
      }
    }
   async checkRole(code,permission){
       let role = await this.getRole(code);
       if(role==permission)
       return true;
       return false;
    }
}
module.exports = new roleService;