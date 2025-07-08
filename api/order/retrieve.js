const express = require("express");
const app = express();
const cors = require("cors");
const { orderReceivedMail } = require("../../services/mail");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/api/order/retrieve", async (req, res) => {
  //   const aa = req.body;

  const testBody = {
    triggerType: "form_submission",
    payload: {
      name: "Order Form",
      siteId: "68120f32151df292344f7f42",
      data: {
        Name: "Sava",
        Email: "sava.stankovic@boopro.tech",
        Phone: "0649623222",
        "Street Address": "Neka ulica 69",
        City: "Nis",
        "Zip Code": "18000",
        Country: "Serbia",
        pageUrl: "https://infinity-planners.webflow.io/planners/buy",
        "Cart Order":
          "1 x Silence of mind,2 x Yearly Planner,1 x To Do blok,1 x Paperclip Rose Gold,",
        Price: "14000",
      },
      submittedAt: "2025-06-26T13:33:53.274Z",
      id: "685d4c41465f33eae47a3a3c",
      formId: "682b477112bb153a28b518f7",
      formElementId: "914e7d9d-e44e-d2c6-c92a-132602648c18",
      pageId: "6827287c2cfc4efeeaba0923",
      publishedPath: "/planners/buy",
      schema: [],
    },
  };
  //   console.log(aa);
  orderReceivedMail(testBody.payload.data, testBody.payload.id);
  //   const data = await response.json();
  //   console.log(data);
  //   console.log(response);
  res.json(testBody);
});

app.listen(7000, () => {
  console.log(`Server running on http://localhost:7000`);
});

// module.exports = app;
