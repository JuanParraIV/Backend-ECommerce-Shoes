const { Router } = require("express");
const { handlePayStripe } = require("../services/payment.service");
const router = Router();

router.post("/", handlePayStripe);

module.exports = router;
