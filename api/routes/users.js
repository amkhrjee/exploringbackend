const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");
const { json } = require("express");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length != 0) {
        return res.status(409).json({
          message: "Mail has already been used",
          user: user,
        });
      } else {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
              return res.status(500).json({
                error: err.message,
              });
            } else {
              const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  res.status(201).json({
                    message: "User created",
                    user: result,
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    error: err.message,
                  });
                });
            }
          });
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted successfully!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

router.get("/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .select("_id email password")
    .exec()
    .then((user) => {
      res.status(200).json({
        user: user,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "User Not Found",
        error: err.message,
      });
    });
});
module.exports = router;
