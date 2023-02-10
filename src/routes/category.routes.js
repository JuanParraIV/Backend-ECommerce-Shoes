const { Router } = require('express');
const { verifyTokenAdmin } = require("../middleware/authjwtadmin");
const router = Router();

const {
  getAllCategories,
  controllerPost,
  controllerGetId,
  controllerGetName,
  controllerDelete,
  controllerPut,
} = require('../services/category.service');

router.get('/all', getAllCategories);

router.get("/id/:id", controllerGetId);

router.get("/name", controllerGetName);

//router.post("/",[verifyTokenAdmin], controllerPost);

router.put("/", [verifyTokenAdmin], controllerPut);

router.delete("/", [verifyTokenAdmin], controllerDelete);

module.exports = router;
