
const { Router } = require("express");

const usersRouter = require('./users.router');

const router = Router();

router.use("/users", usersRouter);

module.exports = router;
