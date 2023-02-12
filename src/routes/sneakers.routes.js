const { Router } = require('express');
const { Add, Delete, getAll, getByCategoryParams, getByBrandParams, getByQueryName, getByIdParams } = require('../services/sneakers.service');
const { verifyToken } = require("../middleware/authjwt");
const { verifyTokenAdmin } = require("../middleware/authjwtadmin");
const router = Router();

/* const service = new CategoryService(); */

router.get('/category/:category_name', getByCategoryParams);
router.get('/brand/:brand_name', getByBrandParams);
router.get('/all', getAll);
router.get('/:id', getByIdParams);
router.get('/', getByQueryName);
router.put("/",[verifyTokenAdmin], Modify);
router.post("/", [verifyTokenAdmin], Add);
router.delete("/", [verifyTokenAdmin], Delete);

module.exports = router;
