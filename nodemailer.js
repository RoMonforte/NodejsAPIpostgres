const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    secure: false,
    port: 587,
    auth: {
        user: 'emmett.weber@ethereal.email',
        pass: 'wWn2PzKBwUhsUbEnEB'
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"emmett.weber@ethereal.email', // sender address
    to: "emmett.weber@ethereal.email", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail();
