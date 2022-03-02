const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.post("/signup", UserController.signup);

router.delete("/:userId", UserController.deleteUser);
//only for dev use
router.get("/:userId", UserController.getOneUser);

//login
router.post("/login", UserController.login);
module.exports = router;
