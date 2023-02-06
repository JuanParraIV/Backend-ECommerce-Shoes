const { Router } = require('express');
const { getAllSneakers, getByCategoryParams, getByBrandParams, getByQueryName } = require('../services/sneakers.service');

const router = Router();

/* const service = new CategoryService(); */

router.get('/category/:category_name', getByCategoryParams);
router.get('/brand/:brand_name', getByBrandParams);
router.get('/all', getAllSneakers);
router.get('/', getByQueryName);

module.exports = router;
