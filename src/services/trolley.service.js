

const { User, Trolley, Sneaker, Category } = require("../libs/postgres");
const { Op } = require("sequelize");
const { user } = require("pg/lib/defaults");


const add_trolley = async (req, res) => {
  let user_id = req.user_id;
  let SneakerId = req.body.id;
  if (!SneakerId) return res.status(400).send("no se envio el id del sneaker por body");
  try {
    let carrito = await Trolley.create({ userId: user_id, SneakerId });

    res.send("Se agrego el Sneaker al carrito");

  } catch (error) {
    res.status(400).send(error);
  }
};

const get_trolley = async (req, res) => {
  let user_id = req.user_id;
  try {


    let carritos = await Sneaker.findAll({
      include: { model: User },
    });
    let array = [];
    for (let i = 0; i < carritos.length; i++) {
      if (carritos[i].dataValues.users.length) {
        for (let j = 0; j < carritos[i].dataValues.users.length; j++) {

          console.log(carritos[i].dataValues.users[j].Trolley);
          if (carritos[i].dataValues.users[j].Trolley.dataValues.userId == user_id) {
            array.push({
              userStock: carritos[i].dataValues.users[j].Trolley.dataValues.userStock,
              id: carritos[i].dataValues.id,
              name: carritos[i].dataValues.name,
              brand: carritos[i].dataValues.brand,
              price: carritos[i].dataValues.price,
              img: carritos[i].dataValues.img,
              description: carritos[i].dataValues.description,
              stock: carritos[i].dataValues.stock,
              status: carritos[i].dataValues.status,
              categoryId: carritos[i].dataValues.categoryId,
              raiting: carritos[i].dataValues.raiting
            });
          }


        }


      }
    }
    res.send(array);
  } catch (error) {
    res.status(400).send(error);
  }
};

const delete_trolley = async (req, res) => {
  let user_id = req.user_id;
  let SneakerId = req.body.id;
  if (!SneakerId) return res.status(400).send("no se envio el id del insturmento por body");
  try {
    await Trolley.destroy({
      where: {
        SneakerId,
        userId: user_id
      }
    });
    res.send("se borro la relacion");

  } catch (error) {
    res.status(400).send(error);
  }
};
const delete_all_trolley = async (req, res) => {
  let user_id = req.user_id;
  try {
    await Trolley.destroy({
      where: { userId: user_id }
    });

    res.send("all connections deleted");
  } catch (error) {
    res.status(400).send(error);
  }

};
const more_Stock = async (req, res) => {
  let user_id = req.user_id;
  let SneakerId = req.body.id;
  if (!SneakerId) return res.status(400).send("no se envio el id del insturmento por body");

  try {
    let carrito = await Trolley.findOne({
      where: { userId: user_id },
      where: { SneakerId }
    });
    carrito.userStock = carrito.userStock + 1;
    await carrito.save();
    res.send("se incremento el stock");
  } catch (error) {
    res.send(error);
  }
};
const less_stock = async (req, res) => {
  let user_id = req.user_id;
  let SneakerId = req.body.id;
  if (!SneakerId) return res.status(400).send("no se envio el id del insturmento por body");

  try {
    let carrito = await Trolley.findOne({
      where: { userId: user_id },
      where: { SneakerId }
    });
    if (carrito.userStock === 1) {
      await Trolley.destroy({
        where: { userId: user_id },
        where: { SneakerId }
      });
      return res.send("se elimino la relacion");
    }
    carrito.userStock = carrito.userStock - 1;
    await carrito.save();
    res.send("se decremento el stock");
  } catch (error) {
    res.send(error);
  }
};


module.exports = {
  get_trolley,
  post_trolley: add_trolley,
  delete_trolley,
  delete_all_trolley,
  less_stock,
  more_Stock
};