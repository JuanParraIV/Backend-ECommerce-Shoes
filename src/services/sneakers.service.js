const { Sneaker } = require('../libs/postgres');

const getAllSneakers = async (req, res) => {
  try {
    let sneakers = await Sneaker.findAll();
    return res.status(200).send(sneakers);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};


module.exports = { getAllSneakers };
