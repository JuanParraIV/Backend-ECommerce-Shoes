const jwt = require('jsonwebtoken');
const { JWT } = process.env;

module.exports = function (req, res, next) {
  const authorization = req.get('authorization');

  let token = null;

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }

  try {
    const decoded = jwt.verify(token, JWT);
    if (!token || !decoded.id)
      return res.status(401).send('Access denied. Token missing or invalid');
    if (decoded.isBanned)
      return res
        .status(401)
        .send('Access denied. You are banned from using Carry');

    res.locals.isAdmin = decoded.isAdmin;
    res.locals.id = decoded.id;
    res.locals.isPremium = decoded.isPremium;

    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};
