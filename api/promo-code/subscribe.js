const express = require("express");
const app = express();
const cors = require("cors");
// const admin = require("firebase-admin"); // Import the Firebase Admin SDK
const sendNewsletterMail = require("../../services/mail");
const generatePromoCode = require("../../services/generatePromoCode");
const checkEmailValidity = require("../../services/checkEmailValidity");
const {
  isEmailSubscribed,
  addToNewsletter,
  checkDuplicatePromoCode,
} = require("../../services/firestore");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/api/promo-code/subscribe", async (req, res) => {
  const isMailValid = checkEmailValidity(req.body.email);
  if (!isMailValid) {
    return res.status(422).json({
      error: "You have entered an invalid email address",
      status: 422,
    });
  }

  const isSubscribed = await isEmailSubscribed("promo-codes", req.body.email);
  if (isSubscribed) {
    res.status(409).json({
      message: "Email is already subscribed to the newsletter.",
    });
  }
  if (!isSubscribed) {
    // await setDoc(docRef, data); // Set the document data
    // console.log("Document written with custom ID:", isSubscribed, data);
    // sendNewsletterMail(data.user_email, data.code_name);

    //   try {
    // console.log("Document written with custom ID:", isSubscribed, data);
    // sendNewsletterMail(data.user_email, data.code_name);

    let promoCode;
    let promoCodeCharacter = 12;
    promoCode = generatePromoCode(promoCodeCharacter);

    let isCodeExist;

    do {
      promoCodeCharacter++;
      generatePromoCode(promoCodeCharacter);
      isCodeExist = checkDuplicatePromoCode(promoCode);
    } while (isCodeExist);

    const dataToEnter = {
      code_name: promoCode,
      discount_type: "percentage",
      discount_value: 10,
      is_subscribed: true,
      is_used: false,
      user_email: req.body.email,
    };
    const a = await addToNewsletter("promo-codes", dataToEnter);
    const mailres = await sendNewsletterMail(req.body.email, promoCode);
    console.log(mailres);
    res.json({
      message:
        "You have successfully subscribed! Check your inbox. Your special promo code is on the way!",
      promoCode: promoCode,
      success: true,
      data: dataToEnter,
      mail: mailres,
    });
  }
});
// app.listen(7000, () => {
//   console.log(`Server running on http://localhost:7000`);
// });

module.exports = app;
