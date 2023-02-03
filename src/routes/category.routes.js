const { Router } = require('express');
const { getAllCategories } = require('../services/category.service');

const router = Router();


router.get('/all', getAllCategories);

module.exports = router;
