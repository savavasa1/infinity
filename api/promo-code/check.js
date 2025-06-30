const express = require("express");
const app = express();
const cors = require("cors");
const { checkPromoCode } = require("../../services/firestore");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/api/promo-code/check", async (req, res) => {
  const response = await checkPromoCode(req.body.code);

  res.json({ response: response, code: req.body.code, status });
});

// app.listen(7000, () => {
//   console.log(`Server running on http://localhost:7000`);
// });

module.exports = app;
