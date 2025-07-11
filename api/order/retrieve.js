const express = require("express");
const app = express();
const cors = require("cors");
const { orderReceivedMail } = require("../../services/mail");
require("dotenv").config();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/api/order/retrieve", async (req, res) => {
  const rqBdy = req.body;
  console.log(rqBdy, "u retrive");
  const prod = await orderReceivedMail(rqBdy.payload.data, rqBdy.payload.id);
  //   const data = await response.json();
  //   console.log(data);
  //   console.log(response);
  res.json(prod);
});

// app.listen(7000, () => {
//   console.log(`Server running on http://localhost:7000`);
// });

module.exports = app;
