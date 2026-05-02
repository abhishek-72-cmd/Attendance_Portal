const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const orgAttendance = require ("../controllers/attendanceController")

function attendanceRoutes() {
  const router = express.Router();
  const {
    checkIn,
    checkOut,
     myAttendance,
    teamAttendance,
    orgAttendance   
  } = require("../controllers/attendanceController");

  router.post("/check-in", authMiddleware, checkIn);
  router.post("/check-out", authMiddleware, checkOut);
  router.get("/my", authMiddleware, myAttendance);

  router.get(
    "/team",
    authMiddleware,
    roleMiddleware(["MANAGER", "HR"]),
    teamAttendance
  );

  router.get(
  "/org",
  authMiddleware,
  roleMiddleware(["HR"]),
  orgAttendance
);

  return router;
}

module.exports = attendanceRoutes;