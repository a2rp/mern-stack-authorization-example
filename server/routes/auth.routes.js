const express = require("express");
const router = express.Router();
const { register, login, logout, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const requireJson = require("../middlewares/requireJson");

router.post("/register", requireJson, register);
router.post("/login", requireJson, login);
router.post("/logout", logout);
router.post("/forgotpassword", requireJson, forgotPassword);
router.put("/resetpassword/:resetToken", requireJson, resetPassword);

module.exports = router;
