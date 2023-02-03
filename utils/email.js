const nodemailer = require('nodemailer')

const sendMail = async options => {
    // build up a transporter 
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "7ba59f6e57c914",
          pass: "1d35866dcfc878"
        }
    });

    // configure content
    var message = {
        from: "sender@server.com",
        to: options.email,
        subject: options.subject,
        text: options.text,
        // html: "<p>HTML version of the message</p>"
      };

    // send
    transporter.sendMail(message)
}

module.exports = sendMail