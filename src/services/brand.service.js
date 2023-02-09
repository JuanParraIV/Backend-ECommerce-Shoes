const { Brand } = require('../libs/postgres');
const { Op } = require("sequelize");

const getAll = async (req, res) => {
  try {
    let brands = await Brand.findAll();
    return res.status(200).send(brands);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

const getById = async (req, res) => {
  try {
    if (req.params.id) {
      let brand = await Brand.findByPk(req.params.id);
      if (!brand) {
        throw new TypeError("Error, Brand not found with this Id");
      }
      return res.status(200).send(brand);
    } else {
      throw new TypeError("Error, The Id entered is not valid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

const getByName = async (req, res) => {
  try {
    if (req.query.name) {
      let brand = await Brand.findOne({
        where: { name: { [Op.iLike]: `%${req.query.name}%` } },
      });
      if (!brand) {
        throw new TypeError("Error, Brand name not found");
      }
      return res.status(200).send(brand);
    } else {
      throw new TypeError("Error, Brand name invalid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

/* const controllerPost = async (req, res) => {
  const name = new String(req.body.name);
  try {
    if (req.body.hasOwnProperty("name") && name.length > 2) {
      let Brands = await Brand.findAll();
      var newBrand = [];
      var existBrand = false;
      if (!Brands[0]) {
        dataBrand.categories.map((Brand) => {
          newBrand.push(Brand);
          if (
            Brand.name.toLocaleLowerCase() ===
            req.body.name.toLocaleLowerCase()
          ) {
            existBrand = true;
          }
        });
      }
      if (!existBrand) {
        newBrand.push(req.body);
      }
      await Brand.bulkCreate(newBrand);
      res.status(200).send("Brand created");
    } else {
      throw new TypeError("Error, Brand name invalid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
}; */

const Modify = async (req, res) => {
  const { id } = req.body;
  const name = new String(req.body.name);
  try {
    if (id && req.body.hasOwnProperty("name") && name.length > 2 && req.body.hasOwnProperty("isBanned")) {
      let brand = await Brand.findByPk(id);
      if (!brand) {
        throw new TypeError("Error, Brand Id not found");
      }
      await Brand.update(req.body);
      res.status(200).send("Brand updated");
    } else {
      throw new TypeError("Error, Brand Id invalid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

const Delete = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      const deleteBrand = await Brand.findByPk(id);
      if (!deleteBrand) {
        throw new TypeError("Error, Brand Id not found");
      }
      deleteBrand.isBanned = true;
      await deleteBrand.save();
      res.status(200).send("Brand deleted");
    } else {
      throw new TypeError("Error, Brand Id invalid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

module.exports = {
  getAll,getById,getByName,Modify,Delete
};

