
const { Router } = require("express");

const categoriesRouter = require('./category.routes');
const sneakersRouter = require('./sneakers.routes');

const router = Router();

router.use("/category", categoriesRouter);
router.use("/sneakers", sneakersRouter);


module.exports = router;
