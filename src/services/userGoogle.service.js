const { User, Admin, Sneaker } = require("../libs/postgres");
const { Op } = require("sequelize");

const getAll = async (req, res) => {
  try {
    let userName = req.query.userName;
    if (userName) {
      let users = await User.findAll({
        where: { userName: { [Op.iLike]: `%${userName}%` } },
      });
      if (users.length) return res.status(200).send(users);
      else return res.status(400).send("Users " + userName + " not found");
    } else {
      let users = await User.findAll();
      if (users.length) return res.status(200).send(users);
      else return res.status(200).send([]);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getUserToken = async (req, res) => {
  try {
    let id = req.user_id;
    if (id) {
      let userExist = await User.findByPk(id, {
        include: { model: Sneaker },
      });
      if (!userExist) throw new TypeError("Error, User not found with this Id");
      return res.status(200).send(userExist);
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send(e);
  }
};

const postUser = async (req, res) => {
  const { email, family_name, given_name, name, nickname, picture } = req.body;
  try {
    if (family_name && email && given_name && name && nickname && picture) {
      const admin = await Admin.findOne({
        where: { [Op.and]: [{ nickname: nickname }, { email: email }] },
      });
      if (admin) {
        throw new TypeError("Error, User exist");
      }
      await User.create(req.body);
      res.status(200).send({ ok: "User created!" });
    } else {
      throw new TypeError("Error, User information invalid");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
};


module.exports = {
  postUser,
  getAll,
  getUserToken,
};
