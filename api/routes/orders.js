const express = require("express");
const router = express.Router();
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "hello from orders!",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST: hello from orders!",
  });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  if (id === "haha") {
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
