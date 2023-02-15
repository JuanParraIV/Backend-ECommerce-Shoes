const { verifyToken } = require("../middleware/authjwt");
const { verifyTokenAdmin } = require("../middleware/authjwtadmin");
const { Router } = require("express");
const router = Router();

const {
  postUser,
  getAll,
  getUserToken,
} = require("../services/userGoogle.service");

router.get("/", getAll);
router.get("/profile", [verifyToken], getUserToken);
router.post("/", postUser);

module.exports = router;
