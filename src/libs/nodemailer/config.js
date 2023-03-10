const nodemailer = require("nodemailer");

//! EL PROTOTIPO DEL TRANSPORTER
class Email {
  constructor(config) {
    this.createTransporter = nodemailer.createTransport(config);
  }
  async sendMail(mailInfo) {
    let mail = await this.createTransporter.sendMail(mailInfo);
  }
}

module.exports = Email;
