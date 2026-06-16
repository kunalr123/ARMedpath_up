const College = require("../models/College");

// Fields that are always public (free preview).
const PREVIEW_FIELDS =
  "name city state type established nirfRank shortDescription totalSeats courseOffered";

// Returns true if the logged-in user can see full details for this college.
const canAccess = (user, collegeId) => {
  if (!user) return false;
  if (user.hasFullPackage) return true;
  return user.unlockedColleges.some((id) => id.toString() === collegeId.toString());
};

// GET /api/colleges  -> list with preview fields only
const getColleges = async (req, res) => {
  try {
    const { search = "", state = "", type = "" } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (state) filter.state = state;
    if (type) filter.type = type;

    const colleges = await College.find(filter)
      .select(PREVIEW_FIELDS)
      .sort({ nirfRank: 1 });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/colleges/:id  -> preview always; full details only if paid.
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const access = canAccess(req.user, college._id);

    if (!access) {
      // Send only the preview fields + a flag.
      return res.json({
        locked: true,
        college: {
          _id: college._id,
          name: college.name,
          city: college.city,
          state: college.state,
          type: college.type,
          established: college.established,
          nirfRank: college.nirfRank,
          shortDescription: college.shortDescription,
          totalSeats: college.totalSeats,
          courseOffered: college.courseOffered,
        },
      });
    }

    // Full access -> return everything.
    res.json({ locked: false, college });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/colleges/meta/filters -> distinct states & types for dropdowns
const getFilters = async (req, res) => {
  try {
    const states = await College.distinct("state");
    const typesList = await College.distinct("type");
    res.json({ states: states.sort(), types: typesList.sort() });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getColleges, getCollegeById, getFilters };
