const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/auth/adminAuthController");
const { rateLimiter } = require("../../middleware/rateLimiter");

// Route for admin register
router.post("/register", adminAuthController.registerAdmin);

// Route for admin login
router.post("/login",  rateLimiter, adminAuthController.loginAdmin);
router.put("/change-password/:id", adminAuthController.changePassword);

module.exports = router;
