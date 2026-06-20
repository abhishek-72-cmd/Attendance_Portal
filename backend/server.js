require("dotenv").config();
const express = require("express");


const cors = require("cors");
const passport = require("passport"); // ✅ import first
require("./config/passport"); // ✅ then load strategy

const app = express();
app.use(passport.initialize());

const port = process.env.PORT || 5000;

// DB
const { connectDB, sequelize } = require("./config/db");

// 🔥 IMPORTANT: Import models so Sequelize knows them before sync
require("./models/userModel");
require("./models/attendanceModel");
require("./models/leaveModel");
require("./models/leaveTypeModel");

// Routes
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes());
app.use("/api/attendance", attendanceRoutes());
app.use("/api/leave", leaveRoutes());
app.use("/api/users", userRoutes());


// Health check
app.get("/", (req, res) => {
  res.send("Employee Attendance API Running...");
});

// Global error handler (optional but good)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});



const startServer = async () => {
  try {
    await connectDB();

    // 🔥 Auto create/update tables
    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: true });
      console.log("Database schema synchronized");
    }

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
