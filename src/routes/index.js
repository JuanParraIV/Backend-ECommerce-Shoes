const { Router } = require("express");

const categoriesRouter = require('./category.routes');
const brandsRouter = require('./brand.routes');
const sneakersRouter = require('./sneakers.routes');
const usersRouter = require('./user.routes');
const userGoogleRouter = require('./userGoogle.routes');
const authRouter = require('./auth.routes');
const paymentRouter = require('./payment.routes');
const adminsRouter = require('./admin.routes');
const trolleyRouter = require('./trolley.routes');
const mailRouter = require('./mail.routes');
const transactionsRouter = require('./transactions.routes');

const router = Router();

router.use("/user", usersRouter);
router.use("/userGoogle", userGoogleRouter);
router.use("/auth", authRouter);
router.use("/payment", paymentRouter);
router.use("/admin", adminsRouter);
router.use("/trolley", trolleyRouter);
router.use("/mail", mailRouter);
router.use("/transaction", transactionsRouter);
router.use("/category", categoriesRouter);
router.use("/brand", brandsRouter);
router.use("/sneakers", sneakersRouter);


module.exports = router;
