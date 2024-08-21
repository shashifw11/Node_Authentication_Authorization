const express = require("express");
const Product = require("../models/product.model");
const router = express.Router();
const {uploadMultiple,uploadSingle} = require("../middleware/upload");

router.post("/single", uploadSingle("image_urls"), async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image_urls: req.file.path,
    });
    return res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/multiple", uploadMultiple("image_urls",3), async (req, res) => {
  try {
    const filePaths = req.files.map((file)=>file.path) // convert all filepath in array of filepath
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image_urls: filePaths,
    });
    return res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const product = await Product.find().lean().exec();
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
