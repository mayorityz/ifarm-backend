// 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
const sgMail = require("@sendgrid/mail");
const key =
  "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";
sgMail.setApiKey(key);

class SendGrid {
  static sendMail(to, body, subject) {
    const msg = {
      to,
      from: "noreply@i-farms.com",
      subject,
      html: `<strong>${body}</strong>`,
    };
    //ES6
    sgMail.send(msg).then(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  }
}

module.exports = SendGrid;
