require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const collegeRoutes = require("./routes/collegeRoutes");
const predictorRoutes = require("./routes/predictorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Connect to the database.
connectDB();

// ---- Middleware ----
// Allow the frontend (Netlify / custom domain) to call this API.
// CLIENT_URL can be a comma-separated list of allowed origins.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser tools (no origin) and any whitelisted origin
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// ---- Routes ----
app.get("/", (req, res) => res.json({ status: "API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/predictor", predictorRoutes);
app.use("/api/payment", paymentRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
