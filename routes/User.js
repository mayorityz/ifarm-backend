const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const userController = require("../controllers/Users");

router.post(
  "/newuser",
  [
    check("firstName").trim().not().isEmpty(),
    check("lastName").trim().not().isEmpty(),
    check("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email Address Supplied"),
    check("pass1")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password Cannot be less than five characters."),
  ],
  userController.newUser
);
router.post("/login", userController.userLogin);

router.get("/profile/:userid", userController.userProfile);
router.post("/updateprofile/:userid", userController.userUpdate);

module.exports = router;
