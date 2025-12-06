const express = require("express");
const app = express();
const cors = require("cors");
const { checkPromoCode, applyPromoCode } = require("../../services/firestore");
require("dotenv").config();

app.use(
  cors({
    origin: process.env.DEV_DOMAIN,
  })
);

app.use(express.json());

app.post("/api/promo-code/check", async (req, res) => {
  const response = await checkPromoCode(req.body.code);
  if (response.code) {
    res.status(response.code).json({
      error: response.message,
      code: req.body.code,
      status: response.code,
    });
  }

  const applyResponse = await applyPromoCode(req.body.code);

  res.json({ response: response, code: req.body.code, status: 200 });
});

// app.listen(7000, () => {
//   console.log(`Server running on http://localhost:7000`);
// });

module.exports = app;
