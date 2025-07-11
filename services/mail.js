const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const sendNewsletterMail = async (mail, promoCode) => {
  // Read HTML email template
  const response = await axios.get(
    "https://infinity-one-tau.vercel.app/services/newsletter.html"
  );
  const emailTemplate = response.data;

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

const orderReceivedMail = async (data, id) => {
  const response = await axios.get(
    "https://infinity-git-feature-order-sava-stankovics-projects.vercel.app/services/orderconfirmation.html"
  );
  const emailTemplate = response.data;

  let variables = {
    name: data.Name,
    email: data.Email,
    phone: data.Phone,
    address: `${data["Street Address"]}, ${data["Zip Code"]} ${data.City}, ${data.Country} `,
    cart: data["Cart Order"],
    total: data["Total Price"],
    subtotal: data["Subtotal Price"],
    OrderID: id,
    shippingMethod: data["Shipping Method"],
  };

  const mapProducts = async () => {
    const arr = variables.cart.split(",");
    const data = await fetch(
      "https://webflow-proxy-savastankovic-sava-stankovics-projects.vercel.app/api/infinity/all-products"
    );
    let table = "";
    const productsInfo = await data.json();
    arr.pop();
    arr.forEach((product) => {
      const everything = product.split(" x ");
      const singleProduct = productsInfo.find(
        (singleProductInfo) => singleProductInfo.product.name === everything[1]
      );
      let newProduct = `<tr class="product-item"><td class="name"><img src=${singleProduct.product["main-image"]} style="width: 48px; height: 48px; display: block; margin-bottom: 16px;"/> ${singleProduct.product.name}</td> <td class="sku">${everything[0]}</td><td>${singleProduct.product.price}</td></tr>`;
      table += newProduct;
    });
    return table;
  };

  const tableAll = await mapProducts();

  console.log(tableAll);

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.error("Error sending email:", error);
  //   }
  //   return { message: "Email sent:", info: info };
  // });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.APP_PASSWORD_NO_SPACES,
    },
  });

  console.log(transporter);

  const template = handlebars.compile(emailTemplate);

  const htmlOutput = template({
    ...variables,
    shipping: "0",
    products: tableAll,
  });

  console.log(htmlOutput);

  // Email options
  const mailOptions = {
    from: "sava.stankovic2002@gmail.com",
    to: data.Email,
    subject: "Thank You for Your Order! 🛍️",
    html: htmlOutput,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return error;
    }
    console.log("Email sent:", info);

    return { message: "Email sent:", info: info };
  });
};

module.exports = { sendNewsletterMail, orderReceivedMail };
