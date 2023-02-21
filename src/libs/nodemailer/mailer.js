const Config = require("./config");
require('dotenv').config();
const { PASS_GMAIL, USER_GMAIL } = process.env;

const transporter = new Config({
  service: 'gmail',
  auth: {
    user: USER_GMAIL,
    pass: PASS_GMAIL,
  },
});

module.exports = transporter

