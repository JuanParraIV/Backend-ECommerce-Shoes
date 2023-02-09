const {verifyToken}=require("../middleware/authjwt")
const { Router } = require("express");
const router = Router();
const {get_transactions, get_user_transactions}=require("../services/transactions.service")
const { verifyTokenAdmin } = require("../middleware/authjwtadmin");

router.get("/",[verifyTokenAdmin],get_transactions)
router.get("/user", [verifyToken], get_user_transactions)


module.exports = router;
