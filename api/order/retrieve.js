const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/api/order/retrieve", async (req, res) => {
  const aa = req.body;
  //   const data = await response.json();
  //   console.log(data);
  //   console.log(response);
  res.json(aa);
});

// app.listen(7000, () => {
//   console.log(`Server running on http://localhost:7000`);
// });

module.exports = app;
