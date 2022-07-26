import express from 'express';
const router = express.Router();
import mainController from '../controllers/mainController';
const md = require('../service/middleWare')
router.get('/', mainController.getHomePage);
router.get('/login',mainController.getLoginPage);
router.get('/test', md.checkCustomer,(req,res)=>{
    res.send({data:'xong'});
})
export default router;
