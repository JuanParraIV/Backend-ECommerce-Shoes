const { categories } = require('./categorias.json');
const { instruments } = require('./instrumentos.json');
const { Instrument, Category } = require("./libs/postgres");


const allData = async (req,res,next) => {
  try {
    const resultQueryFromDb = await Category.findAll();
    if (!resultQueryFromDb.length===0) {
      const categoryArray = categories.map((category) => {
        return {
          name: category.name,
        };
      });
      await Category.bulkCreate(categoryArray);
      return res.status(200).json(categoryArray);
    } else {
      return res.status(200).json(resultQueryFromDb);
    }

  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  allData,
};
