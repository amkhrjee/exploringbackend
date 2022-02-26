const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello from products! 3",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST: hello from products!",
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  if (id === "special") {
    res.status(200).json({
      message: "You found it!",
    });
  } else {
    res.status(200).json({
      message: "Keep trying! 🧐",
    });
  }
});
module.exports = router;
