const sendNewsletterMail = (mail, promoCode) => {
  const nodemailer = require("nodemailer");
  const handlebars = require("handlebars");
  const fs = require("fs");
  const path = require("path");

  // Read HTML email template
  const emailTemplate = fs.readFileSync(
    path.join(__dirname, "budoarmail.html"),
    "utf8"
  );

  // e68fbe4f7dc60d5008db934346032086b8ffd515a0de975f19489a586289aac1 webhook key

  // Setup transporter using Zoho SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: "savatest@zohomail.eu", // Your email
      pass: "sesoje69", // Your email password or app-specific password
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
    from: "savatest@zohomail.eu",
    to: mail,
    subject: "Your 10% Off Coupon Code 🎉",
    html: htmlOutput,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email:", error);
    }
    console.log("Email sent:", info.response);
  });
};

module.exports = sendNewsletterMail;

//   const response = await fetch(
//     "https://api.webflow.com/v2/forms/682b477112bb153a28b518f7/submissions",
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer 1ed415c34ac36422d1a412f3d5611057305a49f1d8a1b531f9a45c3857cf2af3`, // Replace with your actual token
//       },
//     }
//   );
