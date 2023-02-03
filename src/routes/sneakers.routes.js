const { Router } = require('express');
const { getAllSneakers } = require('../services/sneakers.service');

const router = Router();

/* const service = new CategoryService(); */

router.get('/all', getAllSneakers);

module.exports = router;
