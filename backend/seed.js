// Seed script: clears the colleges collection and inserts the dummy data.
// Run with:  npm run seed
require("dotenv").config();
const connectDB = require("./config/db");
const College = require("./models/College");
const colleges = require("./data/colleges");

const seed = async () => {
  try {
    await connectDB();
    await College.deleteMany({});
    await College.insertMany(colleges);
    console.log(`Seeded ${colleges.length} colleges successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
