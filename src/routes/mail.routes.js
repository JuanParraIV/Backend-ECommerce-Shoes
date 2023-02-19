const { Router } = require("express");
const router = Router();
const {
  mailNewsletter,
} = require("../controllers/mailController");

router.post("/news", mailNewsletter);

module.exports = router;
