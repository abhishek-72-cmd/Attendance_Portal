const express = require("express");
const { login, register, hrOnly, managerData } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const passport = require ("passport")
const jwt = require ('jsonwebtoken')



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


// redirect user to google

router.get (
  "/google",
  passport.authenticate("google", {
    scope:["profile", "email"]
  })
)

// google calls this after login 

router.get (
    "/google/authcallback",
    passport.authenticate("google", {
      session:false,
      failureRedirect:  "http://localhost:5173/",
    }),

    (req,res) =>{
      try{
       const user = req.user;
         const token = jwt.sign (
          {
            id: user.id,
            role: user.role,
          },
           process.env.JWT_SECRET,
           {  expiresIn: "1d" }
         )
          // REDIRECT TO ui WIT TOKEN 

          res.redirect(
             `http://localhost:5173/oauth-success?token=${encodeURIComponent(token)}`
          )
      }catch (err){
        console.log (err);
        res.status(500).json ("Internal server error")
      }
    }
)
  return router;
}

module.exports = authRoutes;
