const { Sneaker, Category } = require("./libs/postgres");
const axios = require("axios");


const allData = async (req, res, next) => {
  try {
    const getCategoriesFromJson = await axios.get(
      `http://localhost:5050/categories/`);
    const getSneakersFromJson = await axios.get(
      `http://localhost:5050/sneakers/`);
    const categories = getCategoriesFromJson.data;
    const sneakers = getSneakersFromJson.data;

    const categoryValidation = await Category.findOne({
      where: { id: 1 },
    });
    if (!categoryValidation) {
      await Category.bulkCreate(categories);
      console.log("Categories loaded in db succesfully");
    }

    const instValidation = await Sneaker.findOne({
      where: { id: 1 },
    });

    if (!instValidation) {
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
