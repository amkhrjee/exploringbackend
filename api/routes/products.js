const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Math.round(Math.random() * 1e5) + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || "image/png" || "image/webp") {
    cb(null, true);
  } else {
    cb(new Error("File type not supported!"), false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImg")
    .all()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImg: doc.productImg,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

router.post("/", checkAuth, upload.single("productImg"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImg: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImg: result.productImg,
          url: `http://localhost:3000/products/${result._id}`,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        err: err.message,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            desccription: "Get all products",
            url: "http://localhost:3000/products/",
          },
        });
      } else {
        res.status(404).json({
          message: "Nothing found!",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne(
    {
      _id: id,
    },
    {
      $set: updateOps,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

router.delete("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        err: err.message,
      });
    });
});
module.exports = router;
