const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
  applyLeave,
  myLeaves,
  approveLeave,
  createLeaveType,
  updateLeaveType,
  getAllLeaves,
  getLeaveTypes,
  pendingLeaves
} = require("../controllers/leaveController");

function leaveRoutes() {
  const router = express.Router();

  // ==============================
  // EMPLOYEE + MANAGER
  // ==============================

  // Apply leave
  router.post("/apply", authMiddleware, applyLeave);

  // View own leaves
  router.get("/my", authMiddleware, myLeaves);

  // ==============================
  // MANAGER
  // ==============================

  // Approve / Reject leave
  router.put(
    "/approve/:id",
    authMiddleware,
    roleMiddleware(["MANAGER"]),
    approveLeave
  );

  // ==============================
  // HR
  // ==============================

  // Create leave type
  router.post(
    "/type",
    authMiddleware,
    roleMiddleware(["HR"]),
    createLeaveType
  );

  // Update leave type quota
  router.put(
    "/type/:id",
    authMiddleware,
    roleMiddleware(["HR"]),
    updateLeaveType
  );

  // View all leave requests
  router.get(
    "/all",
    authMiddleware,
    roleMiddleware(["HR"]),
    getAllLeaves
  );

  router.get(
  "/types",
  authMiddleware,
  getLeaveTypes
);


router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(["MANAGER", "HR"]),
  pendingLeaves
);

  return router;
}




module.exports = leaveRoutes;