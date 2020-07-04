require("dotenv").config();
// using nodemailer for mailing services...
const nodemailer = require("nodemailer");
// async function main(to, subject, body) {
// let transporter = nodemailer.createTransport({
//   host: process.env.MAILHOST,
//   port: process.env.MAILPORT,
//   secure: false,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// send mail with defined transport object
// let info = await transporter.sendMail({
//   from: process.env.EMAILFROM,
//   to: "mayority11@gmail.com",
//   subject: "Hello ✔",
//   text: "Hello world?",
//   html: "<b>Hello world?</b>",
// });
// console.log("Message sent: %s", info.messageId);
// }

// main().catch(console.error);
const transporter = nodemailer.createTransport({
  host: process.env.MAILHOST,
  port: process.env.MAILPORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

class Mailer {
  static async registration(to, subject, body) {
    let info = await transporter.sendMail({
      from: process.env.EMAILFROM,
      to,
      subject,
      html: body,
    });
    console.log("Message sent: %s", info.messageId);
  }
}

module.exports = Mailer;
