
const { Router } = require('express');
const {controllerLogin, controllerRegister, controllerLoginGoogle } =require("../services/auth.service");

const router = Router();
router.post("/register",controllerRegister );
router.post("/login", controllerLogin);
router.post("/login/google", controllerLoginGoogle);

module.exports = router;
