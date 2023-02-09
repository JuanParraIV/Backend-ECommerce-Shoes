const { Router } = require("express");
const { verifyToken } = require("../middleware/authjwt");
const router = Router();
const {create_history}=require("../services/history.service")


router.get("/",[verifyToken],create_history)


module.exports = router;
