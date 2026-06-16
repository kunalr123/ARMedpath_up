const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // If true, the student bought the 600rs package and can see ALL colleges.
    hasFullPackage: { type: Boolean, default: false },

    // List of individual college ids the student unlocked at 65rs each.
    unlockedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
