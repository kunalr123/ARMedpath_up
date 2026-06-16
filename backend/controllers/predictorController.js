const College = require("../models/College");

// FREE college predictor based on NEET marks and/or rank.
// This is a simple heuristic on the dummy data. Tune the logic later.
//
// POST /api/predictor
// body: { marks: Number (0-720), rank: Number, category: "General"|"OBC"|"SC"|"ST" }
const predict = async (req, res) => {
  try {
    let { marks, rank, category = "General" } = req.body;
    marks = Number(marks);
    rank = Number(rank);

    if ((!marks || marks < 0 || marks > 720) && (!rank || rank < 1)) {
      return res
        .status(400)
        .json({ message: "Provide valid NEET marks (0-720) or a rank." });
    }

    // If rank not given, estimate it from marks (rough dummy mapping).
    // Higher marks -> better (lower) rank. Approx real NEET trend:
    // ~720 -> rank 1, ~540 -> ~30k, ~360 -> ~60k, lower marks -> larger rank.
    if (!rank || rank < 1) {
      rank = Math.max(1, Math.round((720 - marks) * 170));
    }

    // Pick the cutoff field for the category.
    const field =
      category === "OBC"
        ? "cutoffOBC"
        : category === "SC"
        ? "cutoffSC"
        : category === "ST"
        ? "cutoffST"
        : "cutoffGeneral";

    // A college is "predicted" if the student's rank is within its closing rank.
    // We return preview fields only (predictor is free, full details still paid).
    const eligible = await College.find({ [field]: { $gte: rank } })
      .select("name city state type nirfRank totalSeats courseOffered " + field)
      .sort({ [field]: 1 })
      .limit(40);

    const results = eligible.map((c) => ({
      _id: c._id,
      name: c.name,
      city: c.city,
      state: c.state,
      type: c.type,
      nirfRank: c.nirfRank,
      totalSeats: c.totalSeats,
      courseOffered: c.courseOffered,
      closingRank: c[field],
      chance:
        rank <= c[field] * 0.6
          ? "High"
          : rank <= c[field] * 0.85
          ? "Medium"
          : "Low",
    }));

    res.json({
      estimatedRank: rank,
      category,
      count: results.length,
      colleges: results,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { predict };
