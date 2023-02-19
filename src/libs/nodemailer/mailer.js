const nodemailer = require("nodemailer");
/* const nodemailer = require("nodemailer");

//! EL PROTOTIPO DEL TRASNPORTER
class Email {
  constructor(config) {
    this.createTransporter = nodemailer.createTransport(config);
  }
  async sendMail(mailInfo) {
    let mail = await this.createTransporter.sendMail(mailInfo);
  }
}

module.exports = Email; */

const {MAIL_APP_PASS } = process.env;


 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sneakers.info@gmail.com",
      pass: MAIL_APP_PASS,
    },
  });

 const sendMAil = async (email) => { await transporter.sendMail({
    from: 'Sneakers <sneakers.info@gmail.com>',
    to: `${email}`,
    subject: "Gracias Por confiar en Sneakers",
    //  text: "Hello world?", // plain text body
    html: "gracias por elegirnos, puede revisar los detalles de su compra en su perfil, desde sneakers esperamos que disfrute de su compra y esperamos volver a verlo", // html body
  })}
  module.exports={
    sendMAil
  }
