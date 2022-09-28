const express = require('express');
const router= express.Router();
import brandController from '../controllers/brand.controller'
router.post('/update',brandController.updateBrand);
export default router;