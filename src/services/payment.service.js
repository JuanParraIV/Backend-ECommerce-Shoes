const Stripe = require("stripe");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");
const { Transactions, User, UserGoogle, Sneaker } = require("../libs/postgres");


const stripe = new Stripe(
  "sk_test_51MbTIzJhcFAZvo86Za54V9NR58B67C2DTjAyK73m4ub9t0Xp5EO5QLTJxJeiP1kgoNeHinhl3lLprQHxJyyTeQKh00HJtKVTpy"
);

const crearTransactions = async (user_Id, userType, items, userInfo) => {
  let cost = 0;
  for (let i = 0; i < items.length; i++) {
    cost += items[i].retail_price_cents * items[i].quantity;

    let sneakerToDecreaseStock = await Sneaker.findByPk(items[i].id);
    let actualStock = sneakerToDecreaseStock.stock;
    let newStock = actualStock - items[i].quantity;
    sneakerToDecreaseStock.set({ stock: newStock });
    await sneakerToDecreaseStock.save();
  }

  let orden = await Transactions.create({
    userId: user_Id,
    status: "successful",
    cost,
    cus_address: userInfo.cus_address,
    cus_name: userInfo.cus_name,
    cus_email: userInfo.cus_email,
    cus_phone: userInfo.cus_phone,
    cus_city: userInfo.cus_city,
    cus_country: userInfo.cus_country,
    cus_zip: userInfo.cus_zip,
    sneaker: items,
  });

  let usuario = userType === "user"
    ? await User.findOne({ where: { id: user_Id } })
    : await UserGoogle.findOne({ where: { id: user_Id } });

  orden.setUser(usuario);
  await orden.save();
};

const handlePayStripe = async (req, res) => {
  const { id, items, amount, token, userInfo } = req.body;
  console.log(token);

  let decodedToken;
  if (typeof token.token === 'string') {
    decodedToken = jwt.verify(token.token, process.env.JWT_SECRET);
  } else {
    return res.status(400).send('Invalid token');
  }

  const userId = decodedToken.user_id;
  const userType = token.userType;

  console.log("Amount:", amount);
  const description = items.map((item) => item.details).join(", ");
  console.log("Description:", description);

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description,
      payment_method: id,
      confirm: true,
    });

    console.log("Payment status:", payment.status);
    console.log("User ID:", userId);
    console.log("User type:", userType);

    await crearTransactions(userId, userType, items, userInfo);

    res.json(payment.status);
  } catch (err) {
    const errorMessage = err.raw ? err.raw.message : err.message;
    console.log("Error:", errorMessage);
    res.status(400).send(errorMessage);
  }
};


module.exports = {
  handlePayStripe,
};
