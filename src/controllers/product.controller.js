const express = require("express");
const Product = require("../models/product.model");
const router = express.Router();
const { uploadMultiple, uploadSingle } = require("../middleware/upload");
const authenticate = require("../middleware/authenticate");

router.post(
  "/single",
  authenticate,
  // before you try to upload any thing needs to authenticate that you are the valid user.
  // first authenticate middleware works only then uloadSingle middleware will work.
  // when you go amzone or any thing every body allow to see all of the product even without login it.
  // for creating the you need to seller means have right to create product.
  // so for creating the product your are must be loged in.
  // once you logedin you are getting the authorization token inside request headers.

  uploadSingle("image_urls"),
  async (req, res) => {
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
  }
);

router.post(
  "/multiple",
  authenticate,
  uploadMultiple("image_urls", 3),
  async (req, res) => {
    try {
      const filePaths = req.files.map((file) => file.path); // convert all filepath in array of filepath
      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        image_urls: filePaths,
      });
      return res.status(200).send(product);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const product = await Product.find().lean().exec();
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
