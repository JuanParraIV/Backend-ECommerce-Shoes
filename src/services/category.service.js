const { Category } = require('../libs/postgres');

const controllerGet=async(req, res)=>{
  try {
      let categories = await Category.findAll();
      return res.status(200).send(categories);
  } catch (e) {
      return res.status(400).send(e.message);
  }
}


module.exports = {controllerGet};
