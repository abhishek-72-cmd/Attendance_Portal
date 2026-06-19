const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");


function userRoutes() {
  const router = express.Router();

  const {
    createUser,
    deactivateUser,
    getAllUsers,
    assignManager,
  } = require("../controllers/userController");

  // 👩‍💼 HR: Create user
  router.post(
    "/create",
    authMiddleware,
    roleMiddleware(["HR"]),
    createUser
  );

  // 👩‍💼 HR: Deactivate user
  router.put(
    "/deactivate/:id",
    authMiddleware,
    roleMiddleware(["HR"]),
    deactivateUser
  );

  // 👩‍💼 HR: Get all users
  router.get(
    "/",
    authMiddleware,
    roleMiddleware(["HR"]),
    getAllUsers
  );

  // 👩‍💼 HR: Assign manager
  router.put(
    "/assign-manager/:id",
    authMiddleware,
    roleMiddleware(["HR"]),
    assignManager
  );
 

  
router.put(
  "/update-role/:id",
  authMiddleware,
  roleMiddleware(["HR"]),
  async (req, res) => {
    const { role } = req.body;

    await User.update(
      { role },
      { where: { id: req.params.id } }
    );

    res.json({ message: "Role updated" });
  }
);



  return router;
}

module.exports = userRoutes;