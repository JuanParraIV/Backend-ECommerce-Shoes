const { Router } = require('express');
const { getAllBrands } = require('../services/brand.service');

const router = Router();


router.get('/all', getAllBrands);

module.exports = router;
