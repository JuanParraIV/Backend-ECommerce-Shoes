
const { Router } = require("express");

const categoryRouter = require('./category.router');
const { allData } = require("../bulkcreate");

const router = Router();

router.get("/",allData)
router.use("/category", categoryRouter);


module.exports = router;
