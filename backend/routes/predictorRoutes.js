const express = require("express");
const router = express.Router();
const { predict } = require("../controllers/predictorController");

// Free for everyone (no auth required).
router.post("/", predict);

module.exports = router;
