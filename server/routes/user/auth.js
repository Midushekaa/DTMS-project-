const express = require("express");
const router = express.Router();

const {
  validateRegistration,
} = require("../../middleware/user/validateRegister");
const {
  registerUser,
  loginUser,
} = require("../../controllers/user/auth/authController"); // Added loginUser
const { validateLogin } = require("../../middleware/user/validateLogin");
const { rateLimiter } = require("../../middleware/rateLimiter");
const {
  changePassword,
} = require("../../controllers/user/auth/changePassword");
const { resetPassword } = require("../../controllers/user/auth//resetPassword");

router.post("/register", rateLimiter, validateRegistration, registerUser);
router.post("/login", rateLimiter, validateLogin, loginUser); // Added loginUser here


router.put("/change-password/:id", changePassword);
router.put("/reset-password/:id", resetPassword);

module.exports = router;
