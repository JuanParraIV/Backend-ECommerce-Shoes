const Stripe = require("stripe");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");
const { Transactions, User, Sneaker } = require("../libs/postgres");


const stripe = new Stripe(
  "sk_test_51MbTIzJhcFAZvo86Za54V9NR58B67C2DTjAyK73m4ub9t0Xp5EO5QLTJxJeiP1kgoNeHinhl3lLprQHxJyyTeQKh00HJtKVTpy"
);

const crearTransactions = async (id, userInfo, items) => {



  let cost = 0;
  for (let i = 0; i < items.length; i++) {
    cost = cost + (items[i].price * items[i].count);
    let SneakeroABajarStock = await Sneaker.findByPk(items[i].id);
    let actual = SneakeroABajarStock.stock;
    let nuevo = actual - items[i].count;
    SneakeroABajarStock.set({ stock: nuevo });
    await SneakeroABajarStock.save();
  }



  let orden = await Transactions.create({
    userId: id,
    status: "successful",
    cost,
    cus_address: userInfo.cus_address,
    cus_name: userInfo.cus_name,
    cus_email: userInfo.cus_email,
    cus_phone: userInfo.cus_phone,
    cus_city: userInfo.cus_city,
    cus_country: userInfo.cus_country,
    cus_zip: userInfo.cus_zip,
    Sneaker: items
  });
  let usuario = await User.findOne({
    where: { id }
  });
  orden.setUser(usuario);
  await orden.save();

};

const handlePayStripe = async (req, res) => {
  const { id, items, amount, token, userInfo } = req.body;
  let tokenOBJ = JSON.parse(token);
  let rtoken = tokenOBJ.token;
  const decoded = jwt.verify(rtoken, process.env.JWT_SECRET);
  let user_id = decoded.user_id;
  console.log("soy el amount: ", amount);
  const description = items.map((item) => item.id).join(", ");

  const payment = await stripe.paymentIntents
    .create({
      amount,
      currency: "USD",
      description,
      payment_method: id,
      confirm: true,
    })
    .then((answer) => {
      console.log("ANSWWW:", answer.status);
      crearTransactions(user_id, userInfo, items,).then(() => { console.log("creado"); });
      res.json(answer.status);
    })
    .catch((err) => {
      console.log("ERRRRR:", err.raw.message);
      res.status(400).send(err.raw.message);
    });
};

module.exports = {
  handlePayStripe,
};
