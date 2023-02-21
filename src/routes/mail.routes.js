const { Router } = require("express");
const router = Router();
const {
  mailNewsletter, mailPurchase,
} = require("../services/mail.service");

router.post("/news", mailNewsletter);
router.post("/purchase", mailPurchase);

module.exports = router;
