const { verifyTokenAdmin } = require("../middleware/authjwtadmin");
const { Router } = require("express");
const router = Router();

const {
  getAdmins,
  createAdmin,
  deleteAdmin,
  modifyAdmin,
  getAdminById,
} = require("../services/admin.service");

router.get("/", [verifyTokenAdmin], getAdmins);
router.post("/register", [verifyTokenAdmin], createAdmin);
router.delete("/", [verifyTokenAdmin], deleteAdmin);
router.put("/", [verifyTokenAdmin], modifyAdmin);
router.get("/id", [verifyTokenAdmin], getAdminById);

module.exports = router;
