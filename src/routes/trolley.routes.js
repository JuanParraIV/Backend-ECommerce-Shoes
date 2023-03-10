const { verifyToken } = require("../middleware/authjwt");
const { Router } = require("express");
const router = Router();
const { get_trolley, add_trolley, delete_trolley, delete_all_trolley, more_Stock, less_stock } = require("../services/trolley.service");






router.get("/", [verifyToken], get_trolley);
router.post("/", [verifyToken], add_trolley);
router.delete("/", [verifyToken], delete_trolley);
router.delete("/all", [verifyToken], delete_all_trolley);
router.post("/more", [verifyToken], more_Stock);
router.post("/less", [verifyToken], less_stock);







module.exports = router;
