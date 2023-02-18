const jwt = require("jsonwebtoken");
const { User, Trolley, Sneaker, Category, UserGoogle } = require("../libs/postgres");
const { Op } = require("sequelize");
const { user } = require("pg/lib/defaults");

/* const add_trolley = async (req, res) => {
  const { items, amount, token } = req.body;
  const decodedToken = jwt.verify(token.token, process.env.JWT_SECRET);

  const userId = decodedToken.user_id;
  const userType = token.userType;
  const quantities = items.map(item => item.quantity);
  const productIds = items.map(item => item.id);

  const findUser = await User.findOne({ where: { id: userId } });
  const findGoogleUser = await UserGoogle.findOne({ where: { id: userId } });
  const usuario = userType === "user" ? findUser : findGoogleUser;

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  try {
    const cartItems = await Promise.all(productIds.map(async (productId, index) => {
      const product = await Sneaker.findByPk(productId);
      if (!product) {
        throw new Error(`Producto no encontrado con ID ${productId}`);
      }
      const trolleyItem = await Trolley.findOne({
        where: {
          userId: usuario.id,
          sneakerId: product.id
        }
      });
      if (trolleyItem) {
        trolleyItem.quantity += quantities[index];
        await trolleyItem.update({ quantity: trolleyItem.quantity });
        return trolleyItem;
      } else {
        const newTrolleyItem = await Trolley.create({
          userId: usuario.id,
          sneakerId: product.id,
          quantity: quantities[index]
        });
        return newTrolleyItem;
      }
    }));

    res.send('Se agregaron los items al carrito');
  } catch (error) {
    res.status(400).send(error.message);
  }
}; */

const add_trolley = async (req, res) => {
  const { items, amount, token } = req.body;
  let decodedToken;
  if (token && token.token) {
    decodedToken = jwt.verify(token.token, process.env.JWT_SECRET);
  } else {
    return res.status(400).send('Invalid token');
  }

  const userId = decodedToken.user_id;
  const userType = token.userType;
  const quantities = items.map(item => item.quantity);
  const productIds = items.map(item => item.id);

  const findUser = await User.findOne({ where: { id: userId } });
  const findGoogleUser = await UserGoogle.findOne({ where: { id: userId } });

  let usuario;
  if (userType === "user") usuario = findUser;
  if (userType === "googleUser") usuario = findGoogleUser;

  const products = await Sneaker.findAll({ where: { id: productIds } });
  const sneakerIds = products.map(item => item.id);

  if (!usuario || !products) {
    return res.status(404).json({ message: 'Usuario o producto no encontrado' });
  }

  try {
    const trolleyItems = sneakerIds.map((sneakerId, index) => ({
      userId: usuario.id,
      sneakerId,
      quantity: quantities[index]
    }));

    await Trolley.bulkCreate(trolleyItems);

    res.send('Se agregaron los items al carrito');
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
