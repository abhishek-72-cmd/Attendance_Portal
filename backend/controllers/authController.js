const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.is_active)
      return res.status(403).json({ message: "User deactivated" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        lastActivity: Date.now(), 
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "15m" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, manager_id } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      manager_id,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const hrOnly = async (req, res) => {
  try {
    if (req.user.role !== "HR") {
      return res.status(403).json({ message: "Access denied. HR only." });
    }

    res.json({
      message: "Welcome HR",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const managerData = async (req, res) => {
  try {
    if (req.user.role !== "MANAGER") {
      return res.status(403).json({ message: "Access denied. Manager only." });
    }

    res.json({
      message: "Manager access granted",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login,register,hrOnly,managerData };