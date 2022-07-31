import express from 'express';
const router = express.Router();
import accountService from '../service/account.service';

router.get('/', async (req, res) => {
   const accounts = await accountService.getAllAcount();
   res.json({ accounts });
});
export default router;
