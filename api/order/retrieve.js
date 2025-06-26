const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

//0c8c53b50b609bcf1e01203a639ff7cdf0513528b5ab3b3bf8a6b84be5a61bad

app.get("/api/order/retrieve", async (req, res) => {
  const aa = req.body;
  console.log(aa);
  //   const data = await response.json();
  //   console.log(data);
  //   console.log(response);
  res.json(aa);
});

// app.listen(7000, () => {
//   console.log(`Server running on http://localhost:7000`);
// });

module.exports = app;
