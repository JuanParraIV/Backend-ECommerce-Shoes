const { Router } = require("express");

const categoriesRouter = require('./category.routes');
const brandsRouter = require('./brand.routes');
const sneakersRouter = require('./sneakers.routes');
const usersRouter = require('./user.routes');
const authRouter = require('./auth.routes');
const paymentRouter = require('./payment.routes');
const adminsRouter = require('./admin.routes');
const trolleyRouter = require('./trolley.routes');
//const mailController = require('./mail.routes');
const transactionsRouter = require('./transactions.routes');

const router = Router();

router.use("/user", usersRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);
router.use("/admin", adminsRouter);
router.use("/trolley", trolleyRouter);
/* router.use("/mail", mailController); */
router.use("/transaction", transactionsRouter);
router.use("/category", categoriesRouter);
router.use("/brand", brandsRouter);
router.use("/sneakers", sneakersRouter);


module.exports = router;
