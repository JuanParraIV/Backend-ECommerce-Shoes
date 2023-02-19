const { Router } = require("express");
const router = Router();
const {
  mailNewsletter,
} = require("../services/mail.service");

router.post("/news", mailNewsletter);

module.exports = router;
