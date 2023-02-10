const { Router } = require('express');
const { getAll,getById,getByName,Modify,Delete } = require('../services/brand.service');
const {verifyTokenAdmin}=require("../middleware/authjwtadmin")

const router = Router();


router.get('/all', getAll);

router.get("/id/:id", getById);

router.get("/name", getByName);

//router.post("/",[verifyTokenAdmin], controllerPost);

router.put("/",[verifyTokenAdmin], Modify);

router.delete("/",[verifyTokenAdmin], Delete);


module.exports = router;
