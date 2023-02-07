const { Op } = require("sequelize");
const { Sneaker } = require('../libs/postgres');


const getAllSneakers = async (req, res) => {
  try {
    let sneakers = await Sneaker.findAll();
    return res.status(200).send(sneakers);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

const getByIdParams = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send(`Error, Sneaker with ID ${id} not found`);
    }

    const sneaker = await Sneaker.findOne({
      where: {
        id,
      },
    });

    if (!sneaker || sneaker.length === 0) {
      return res.status(400).send(`Error, Sneaker with ID ${id} not found`);
    }

    return res.status(200).send(sneaker);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getByBrandParams = async (req, res, next) => {
  try {
    const { brand_name } = req.params;
    if (!brand_name) {
      return res.status(400).send("Error, Sneaker Brand name not provided");
    }

    const sneaker = await Sneaker.findAll({
      where: {
        brand_name: {
          [Op.iLike]: `%${brand_name}%`,
        },
      },
    });

    if (!sneaker || sneaker.length === 0) {
      return res.status(400).send(`Error, Sneaker Brand ${brand_name} not found`);
    }

    return res.status(200).send(sneaker);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
const getByCategoryParams = async (req, res, next) => {
  try {
    const { category_name } = req.params;
    if (!category_name) {
      return res.status(400).send("Error, Sneaker Category name not provided");
    }

    const sneaker = await Sneaker.findAll({
      where: {
        category_name: {
          [Op.overlap]: [category_name]
        },
      },
    });

    if (!sneaker || sneaker.length === 0) {
      return res.status(400).send(`Error, Sneaker Category ${category_name} not found`);
    }

    return res.status(200).send(sneaker);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getByQueryName = async (req, res, next) => {
  try {
    const { category_name, brand_name, name} = req.query;
    const where = {};

    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (category_name) {
      where.category_name = {
        [Op.overlap]: [category_name],
      };
    }

    if (brand_name) {
      where.brand_name = {
        [Op.iLike]: `%${brand_name}%`,
      };
    }

    if (!category_name && !brand_name && !name) {
      return res.status(400).send("Error, Sneaker Name, Category name or Brand name not provided");
    }

    const sneaker = await Sneaker.findAll({ where });

    if (!sneaker || sneaker.length === 0) {
      return res
        .status(400)
        .send(`Error, Sneaker ${name} with Category name ${category_name} and/or Brand name ${brand_name} not found`);
    }

    return res.status(200).send(sneaker);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = { getAllSneakers, getByBrandParams, getByCategoryParams, getByQueryName, getByIdParams};
