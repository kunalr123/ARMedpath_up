const express = require("express");
const router = express.Router();
const {
  getColleges,
  getCollegeById,
  getFilters,
} = require("../controllers/collegeController");
const { optionalAuth } = require("../middleware/auth");

router.get("/", getColleges);
router.get("/meta/filters", getFilters);
// optionalAuth: works for guests (preview) and logged-in users (full if paid)
router.get("/:id", optionalAuth, getCollegeById);

module.exports = router;
