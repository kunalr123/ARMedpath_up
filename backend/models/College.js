const mongoose = require("mongoose");

// College schema. "preview" fields are visible to everyone (free).
// "full detail" fields are only returned after the student has paid.
const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    type: { type: String, default: "Government" }, // Government / Private / Deemed
    established: { type: Number },
    nirfRank: { type: Number },

    // ---- Preview (free) ----
    shortDescription: { type: String },
    totalSeats: { type: Number },
    courseOffered: { type: String, default: "MBBS" },

    // ---- Full details (paid) ----
    fullDescription: { type: String },
    annualFees: { type: String },
    hostelFees: { type: String },
    cutoffGeneral: { type: Number }, // closing rank (General)
    cutoffOBC: { type: Number },
    cutoffSC: { type: Number },
    cutoffST: { type: Number },
    placementInfo: { type: String },
    facilities: [{ type: String }],
    address: { type: String },
    website: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
