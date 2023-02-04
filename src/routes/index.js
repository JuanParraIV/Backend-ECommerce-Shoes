const { Router } = require("express");

const brandsRouter = require('./brand.routes');
const categoriesRouter = require('./category.routes');
const sneakersRouter = require('./sneakers.routes');

const router = Router();

router.use("/brand", brandsRouter);
router.use("/category", categoriesRouter);
router.use("/sneakers", sneakersRouter);


module.exports = router;
