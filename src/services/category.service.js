const { Category } = require('../libs/postgres');

const getAllCategories = async (req, res) => {
  try {
    let categories = await Category.findAll();
    return res.status(200).send(categories);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};


module.exports = { getAllCategories };
