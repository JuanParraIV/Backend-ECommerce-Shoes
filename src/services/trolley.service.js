const jwt = require("jsonwebtoken");
const { User, Trolley, TrolleyGoogle, Sneaker, Category, UserGoogle } = require("../libs/postgres");
const { Op } = require("sequelize");
const { user } = require("pg/lib/defaults");

/* const add_trolley = async (req, res) => {
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

  const products = await Sneaker.findAll({ where: { id: productIds } });
  const sneakerIds = products.map(item => item.id);

  let usuario;
if (userType === 'user') {
  usuario = findUser;
} else if (userType === 'googleUser') {
  usuario = findGoogleUser;
}

if (!usuario || !products) {
  return res.status(404).json({ message: 'Usuario o producto no encontrado' });
}

try {
  const trolleyItems = await Promise.all(sneakerIds.map(async (sneakerId, index) => {
    const product = products.find(p => p.id === sneakerId);
    const trolleyItem = await Trolley.findOne({
      where: {
        [userType === 'user' ? 'userId' : 'UserGoogleId']: usuario.id,
        sneakerId: sneakerId
      }
    });

    if (trolleyItem) {
      trolleyItem.quantity = quantities[index];
      await trolleyItem.save();
      return trolleyItem;
    } else {
      const newTrolleyItem = await Trolley.create({
        [userType === 'user' ? 'userId' : 'UserGoogleId']: usuario.id,
        sneakerId: sneakerId,
        quantity: quantities[index]
      });
      return newTrolleyItem;
    }
  }));

  res.send('Se agregaron los items al carrito');
} catch (error) {
  res.status(400).send(error);
}
}; */
const add_trolley = async (req, res) => {
  try {
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

    let usuario, trolleyModel;
    if (userType === 'googleUser') {
      usuario = await UserGoogle.findByPk(userId);
      trolleyModel = TrolleyGoogle;
    } else {
      usuario = await User.findByPk(userId);
      trolleyModel = Trolley;
    }

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const products = await Sneaker.findAll({ where: { id: productIds } });
    const sneakerIds = products.map(item => item.id);

    if (!products) {
      return res.status(404).json({ message: 'Productos no encontrados' });
    }


    const trolleyItems = await Promise.all(items.map(async (item) => {
      const product = products.find(p => p.id === item.id);

      let trolleyItem = await trolleyModel.findOne({
        where: {
          [userType === 'googleUser' ? 'UserGoogleId' : 'UserId']: userId,
          SneakerId: item.id
        }
      });

      if (trolleyItem) {
        trolleyItem.quantity = item.quantity;
        await trolleyItem.save();
        return trolleyItem
      } else {
        trolleyItem = await trolleyModel.create({
          [userType === 'googleUser' ? 'UserGoogleId' : 'UserId']: userId,
          SneakerId: item.id,
          quantity: item.quantity
        });
        console.log(usuario.constructor.name)
        await trolleyItem[`set${usuario.constructor.name}`](usuario);
        return trolleyItem
      }
    }));

    res.send('Se agregaron los items al carrito');
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const get_trolley = async (req, res) => {
  const { token } = req.body;
  let decodedToken;
  if (token && token.token) {
    decodedToken = jwt.verify(token.token, process.env.JWT_SECRET);
  } else {
    return res.status(400).send('Invalid token');
  }

  const userId = decodedToken.user_id;
  const userType = token.userType;

  let usuario;
  if (userType === 'user') {
    usuario = await User.findOne({ where: { id: userId } });
  } else if (userType === 'googleUser') {
    usuario = await UserGoogle.findOne({ where: { id: userId } });
  }

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  try {
    const trolleyItems = await Trolley.findAll({
      where: {
        [userType === 'user' ? 'userId' : 'UserGoogleId']: usuario.id
      },
      include: [Sneaker]
    });

    res.json(trolleyItems);
  } catch (error) {
    res.status(400).send(error);
  }
};

const delete_trolley = async (req, res) => {
  const { id, token } = req.body;
  let decodedToken;
  if (token && token.token) {
    decodedToken = jwt.verify(token.token, process.env.JWT_SECRET);
  } else {
    return res.status(400).send('Invalid token');
  }

  const userId = decodedToken.user_id;
  const userType = token.userType;

  const findUser = await User.findOne({ where: { id: userId } });
  const findGoogleUser = await UserGoogle.findOne({ where: { id: userId } });

  let usuario;
  if (userType === 'user') {
    usuario = findUser;
  } else if (userType === 'googleUser') {
    usuario = findGoogleUser;
  }

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  try {
    await Trolley.destroy({
      where: {
        [userType === 'user' ? 'userId' : 'UserGoogleId']: usuario.id,
        sneakerId: id
      }
    });

    res.send('El producto se eliminó del carrito');
  } catch (error) {
    res.status(400).send(error);
  }
};
const delete_all_trolley = async (req, res) => {
  const { token } = req.body;
  let decodedToken;

  if (token && token.token) {
    decodedToken = jwt.verify(token.token, process.env.JWT_SECRET);
  } else {
    return res.status(400).send('Invalid token');
  }

  const userId = decodedToken.user_id;
  const userType = token.userType;

  let usuario;
  if (userType === 'user') {
    usuario = await User.findOne({ where: { id: userId } });
  } else if (userType === 'googleUser') {
    usuario = await UserGoogle.findOne({ where: { id: userId } });
  }

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  try {
    await Trolley.destroy({
      where: {
        [userType === 'user' ? 'userId' : 'UserGoogleId']: usuario.id
      }
    });

    res.send('Se eliminaron todos los productos del carrito');
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
