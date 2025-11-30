const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const userMiddleware=require("../middleware/auth.middleware")
const { body } = require("express-validator");


router.post(
  "/register",
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
  userController.createUserController
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
  userController.loginController
);

router.get('/logout', userMiddleware.authUser, userController.logoutController);
router.post("/profile",userMiddleware.authUser,userController.profileController)
module.exports = router;
