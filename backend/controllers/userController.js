const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    role,
  });

  res.json(user);
};

const deactivateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  user.is_active = false;
  await user.save();

  res.json({ message: "User deactivated" });
};

const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const assignManager = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.manager_id = req.body.manager_id;
    await user.save();

    res.json({ message: "Manager assigned successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createUser, deactivateUser, getAllUsers, assignManager };