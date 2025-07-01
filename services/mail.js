const sendNewsletterMail = async (mail, promoCode) => {
  const nodemailer = require("nodemailer");
  const handlebars = require("handlebars");
  const fs = require("fs");
  const path = require("path");
  require("dotenv").config();

  // Read HTML email template
  const emailTemplate = fs.readFileSync(
    path.join(__dirname, "newsletter.html"),
    "utf8"
  );

  // Setup transporter using Zoho SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.APP_PASSWORD_NO_SPACES,
    },
  });

  const template = handlebars.compile(emailTemplate);
  const data = {
    COUPON_CODE: promoCode,
    YEAR: new Date().getFullYear(),
    SHOP_LINK: "https://infinity-planners.webflow.io/planners/home",
  };
  const htmlOutput = template(data);

  // Email options
  const mailOptions = {
    from: process.env.MAIL,
    to: mail, // Replace with subscriber's email
    subject: "Your 10% Off Coupon Code 🎉",
    html: htmlOutput,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return { message: "Email sent:", info: info };
  });
};

module.exports = sendNewsletterMail;
