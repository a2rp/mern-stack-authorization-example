const express = require("express");
const router = express.Router();
const { getPrivateData } = require("../controllers/private.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/", protect, getPrivateData);

module.exports = router;
