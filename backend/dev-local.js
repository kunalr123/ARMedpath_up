// Local-only dev runner: starts an IN-MEMORY MongoDB (no install, no real URI),
// seeds the 40 dummy colleges, then launches the normal server.
//
// Use this ONLY for local testing:  npm run dev:local
// It does NOT affect production. On Render you still use a real MONGO_URI.

const { MongoMemoryServer } = require("mongodb-memory-server");

(async () => {
  // 1. Boot an in-memory MongoDB and expose it via MONGO_URI.
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;

  // Sensible defaults so you don't need a .env at all for local testing.
  process.env.JWT_SECRET = process.env.JWT_SECRET || "local_dev_secret_change_me";
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
  process.env.SINGLE_COLLEGE_PRICE = process.env.SINGLE_COLLEGE_PRICE || "6500";
  process.env.FULL_PACKAGE_PRICE = process.env.FULL_PACKAGE_PRICE || "60000";
  process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  process.env.PORT = process.env.PORT || "5000";
  // No Razorpay keys -> payments run in DEMO MODE (unlock without real money).

  console.log("In-memory MongoDB started.");

  // 2. Seed the dummy colleges into the in-memory DB.
  const mongoose = require("mongoose");
  await mongoose.connect(uri);
  const College = require("./models/College");
  const colleges = require("./data/colleges");
  await College.deleteMany({});
  await College.insertMany(colleges);
  console.log(`Seeded ${colleges.length} colleges into in-memory DB.`);
  await mongoose.disconnect();

  // 3. Start the real server (it will reconnect using the same MONGO_URI).
  require("./server");

  // 4. Clean up the in-memory DB when you stop the process (Ctrl+C).
  const shutdown = async () => {
    await mongod.stop();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
})();
