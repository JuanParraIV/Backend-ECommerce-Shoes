const { Router } = require('express');

const router = Router();
const { controllerGet } = require('../services/category.service');

/* const service = new CategoryService(); */

router.get('/all', controllerGet);

module.exports = router;
