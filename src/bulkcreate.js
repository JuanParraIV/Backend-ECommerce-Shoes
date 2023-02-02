const { Instrument, Category } = require("./libs/postgres");
const axios = require("axios");


const allData = async (req,res,next) => {
  try {
    const getCategoriesFromJson = await axios.get(
      `http://localhost:5050/categories/`);
    const getinstrumentsFromJson = await axios.get(
        `http://localhost:5050/instruments/`);
      const categories =getCategoriesFromJson.data;
      const instruments =getinstrumentsFromJson.data;

      const categoryValidation = await Category.findOne({
        where: { id: 1 },
      });
      if (!categoryValidation) {
        await Category.bulkCreate(categories);
        console.log("Categories loaded in db succesfully");
      }

      const instValidation = await Instrument.findOne({
        where: { id: 1 },
      });

      if (!instValidation) {
        const inst = instruments.map(async (e) => {
          await Instrument.create(e).then(async (x) => {
            const category = e.category;
            let newInstrumentCategory = await Category.findOne({
              where: {
                name: category,
              },
            });
            await x.setCategory(newInstrumentCategory);
          });
        });

        console.log("Instruments loaded in db succesfully");
      }

  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  allData,
};
