const { Op } = require("sequelize");
const { Sneaker, Category } = require('../libs/postgres');


const getAll = async (req, res) => {
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
    const { category_name, brand_name, name } = req.query;
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

const createNewProducts = async (req, res, next) => {
  const { brand_name, category_name, name, retail_price_cents, color, size_range, grid_picture_url, original_picture_url, main_picture_url, details, stock, status } =
    req.body;

  const nameUpperCase = name.split(" ");
  for (let i = 0; i < nameUpperCase.length; i++) {
    nameUpperCase[i] =
      nameUpperCase[i][0].toUpperCase() + nameUpperCase[i].substr(1);
  }
  const finalName = nameUpperCase.join(" ");

  try {
    let newSneakerCategory = await Category.findOne({
      where: {
        name: category_name,
      },
    });
    if (!newSneakerCategory) {
      throw new TypeError("Category not found");
    } else {
      let newSneaker = await Sneaker.create({ brand_name, category_name, name, retail_price_cents, color, size_range, grid_picture_url, original_picture_url, main_picture_url, details, stock, status });
      await newSneaker.setCategory(newSneakerCategory);
      return res.status(200).json({ message: "Activity successfully added" });
    }
  } catch (error) {
    next(error);
  }
};
const Delete = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      const deleteSneaker = await Sneaker.findByPk(id);
      if (!deleteSneaker) {
        throw new TypeError("Error, Sneaker not found with this Id");
      }
      deleteSneaker.isBanned = true;
      await deleteSneaker.save();
      res.status(200).send("Sneaker deleted");
    } else {
      throw new TypeError("Error, The Id entered is not valid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

/* const Modify = async (req, res) => {
  try {
    const {
      id,
      name,
      brand,
      price,
      img,
      description,
      stock,
      status,
      category,
      isBanned,
    } = req.body;

    if (
      !id ||
      !name ||
      !brand ||
      !price ||
      !img ||
      !description ||
      !stock ||
      !status ||
      !category ||
      isBanned === null
    ) {
      throw new TypeError("data sent incorrectly");
    }

    let Sneaker = await Sneaker.findByPk(parseInt(id));
    if (!Sneaker) throw new TypeError("incorrect id");

    await Sneaker.update({
      name,
      brand,
      price: parseInt(price),
      img,
      description,
      stock: parseInt(stock),
      status,
      isBanned: stock == 0 ? true : false,
    });

    let newSneakerCategory = await Category.findOne({
      where: {
        name: category,
      },
    });
    if (!newSneakerCategory)
      throw new TypeError("category sent incorrectly");
    Sneaker.setCategory(newSneakerCategory);

    Sneaker.save();
    res.status(200).send("successfully edited");
  } catch (error) {
    res.status(400).send(error);
  }
}; */

module.exports = { createNewProducts, Delete, getAll, getByBrandParams, getByCategoryParams, getByIdParams, getByQueryName };
