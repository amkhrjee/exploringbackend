const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controllers/product");

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

router.get("/", ProductController.getAllProducts);
router.post(
  "/",
  checkAuth,
  upload.single("productImg"),
  ProductController.createProduct
);
router.get("/:productId"), ProductController.getOneProduct;
router.patch("/:productId", checkAuth, ProductController.patchOneProduct);
router.delete("/:productId", checkAuth, ProductController.deleteOneProduct);
module.exports = router;
