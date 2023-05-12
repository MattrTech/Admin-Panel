const express = require("express");
const router = express.Router();

const { register, login, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);
router.route("/logout").get(logout);

module.exports = router;