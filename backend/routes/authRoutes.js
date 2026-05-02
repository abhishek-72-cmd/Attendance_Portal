const express = require("express");
const { login, register, hrOnly, managerData } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

function authRoutes() {
  const router = express.Router();

  router.get("/test", (req, res) => {
    res.json({ message: "Auth route working ✅" });
  });

  router.post("/login", login);

  // ✅ Register API (for testing / HR use)
  router.post("/register", register);

  // ✅ HR only
  router.get("/hr-only", authMiddleware, roleMiddleware(["HR"]), (req, res) => {
    res.json({ message: "Welcome HR" });
  });

  // ✅ Manager + HR
  router.get(
    "/manager-data",
    authMiddleware,
    roleMiddleware(["MANAGER", "HR"]),
    (req, res) => {
      res.json({ message: "Manager/HR access granted" });
    }
  );


  router.get("/hr-only", authMiddleware, hrOnly);


router.get("/manager-data", authMiddleware, managerData);

  return router;
}

module.exports = authRoutes;