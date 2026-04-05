const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/infinity/all-products", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.webflow.com/v2/sites/68120f32151df292344f7f42/products?offset=0&limit=100",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer 1ed415c34ac36422d1a412f3d5611057305a49f1d8a1b531f9a45c3857cf2af3`, // Replace with your actual token
        },
      }
    );
    const data = await response.json();

    const bundlesResponse = await fetch(
      "https://api.webflow.com/v2/collections/682b086b6f0714db8c0ad64d/items?offset=0&limit=100",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer 1ed415c34ac36422d1a412f3d5611057305a49f1d8a1b531f9a45c3857cf2af3`, // Replace with your actual token
        },
      }
    );
    const bundlesData = await bundlesResponse.json();

    // bundles collection id 682b086b6f0714db8c0ad64d
    let bundles = bundlesData.items.map((bundle) => {
      return {
        product: {
          id: bundle.id,
          isDraft: bundle.isDraft,
          description: bundle.fieldData.description,
          shippable: true,
          "default-sku": bundle.id,
          name: bundle.fieldData.name,
          slug: `bundles/${bundle.fieldData.slug}`,
          "main-image": bundle.fieldData["image"].url ?? "",
          price: `${bundle.fieldData.price} RSD`,
          "sold-out": bundle.fieldData["sold-out"],
          "sold-out-soon": bundle.fieldData["sold-out-soon"],
          digital: false,
        },
      };
    });
    let returned = data.items.map((product) => {
      return {
        product: {
          id: product.product.id,
          isDraft: product.product.isDraft,
          description: product.product.fieldData.description,
          shippable: product.product.fieldData.shippable,
          "default-sku": product.product.fieldData["default-sku"],
          name: product.product.fieldData.name,
          slug: `product/${product.product.fieldData.slug}`,
          "main-image": product.skus[0].fieldData["main-image"].url,
          price: `${product.skus[0].fieldData.price.value} ${product.skus[0].fieldData.price.unit}`,
          digital: product.product.fieldData.digitalni,
          "sold-out": product.product.fieldData["sold-out"],
          "sold-out-soon": product.product.fieldData["sold-out-soon"],
        },
      };
    });
    const final = bundles.concat(returned);
    res.json(final);
  } catch (error) {
    console.error("Error fetching external data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(7000, () => {
  console.log(`Server running on http://localhost:7000`);
});

// module.exports = app;
