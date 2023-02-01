const { Router } = require('express');

const UserService = require('../services/category.service');

const router = Router();
const service = new UserService();

router.get('/', async (req, res, next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports=router;
