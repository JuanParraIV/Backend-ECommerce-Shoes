const { Sneaker, Category, Brand } = require("./libs/postgres");
const { brands } = require("./brands.json");
const { categories } = require("./categories.json");
const { sneakers } = require("./sneaker.json");

const axios = require("axios");


const allData = async (req, res, next) => {
  try {
    /* const getCategoriesFromJson = await axios.get(
      `http://localhost:5050/categories/`);
    const getSneakersFromJson = await axios.get(
      `http://localhost:5050/sneakers/`);
    const categories = getCategoriesFromJson.data;
    const sneakers = getSneakersFromJson.data; */
    const brandValidation = await Brand.findOne({
      where: { id: 1 },
    });
    if (!brandValidation) {
      await Brand.bulkCreate(brands);
      console.log("Brands loaded in db succesfully");
    }


    const categoryValidation = await Category.findOne({
      where: { id: 1 },
    });
    if (!categoryValidation) {
      await Category.bulkCreate(categories);
      console.log("Categories loaded in db succesfully");
    }

    const sneakValidation = await Sneaker.findOne({
      where: { id: 1 },
    });

    if (!sneakValidation) {
      const sneak = sneakers.map(async (e) => {
        await Sneaker.create(e).then(async (x) => {
          const category = e.category;
          let newSneakerCategory = await Category.findOne({
            where: {
              name: category,
            },
          });
          await x.setCategory(newSneakerCategory);
        });
      });

      console.log("Sneakers loaded in db succesfully");
    }

  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  allData,
};
