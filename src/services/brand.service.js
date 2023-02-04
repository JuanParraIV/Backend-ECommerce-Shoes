const { Brand } = require('../libs/postgres');

const getAllBrands = async (req, res) => {
  try {
    let brands = await Brand.findAll();
    return res.status(200).send(brands);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};


module.exports = { getAllBrands };
