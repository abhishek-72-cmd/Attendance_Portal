const db = require("../models"); 
const { Op } = require("sequelize");
const User = db.User;
const Attendance = db.Attendance;


User.hasMany(Attendance, { foreignKey: "user_id" });
Attendance.belongsTo(User, { foreignKey: "user_id" });


const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({
      where: { user_id: userId, date: today },
    });

    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = await Attendance.create({
      user_id: userId,
      date: today,
      check_in: new Date(),
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      where: { user_id: userId, date: today },
    });

    if (!record) {
      return res.status(400).json({ message: "Check-in first" });
    }

    record.check_out = new Date();
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 1. MY ATTENDANCE (Employee + Manager + HR)
const myAttendance = async (req, res) => {
  try {
    const data = await Attendance.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json({
      message: "My attendance fetched",
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 
//  2. TEAM ATTENDANCE (Manager)
const teamAttendance = async (req, res) => {
  try {
    const team = await User.findAll({
      where: { manager_id: req.user.id },
    });

    const ids = team.map((u) => u.id);

    if (ids.length === 0) {
      return res.json({
        message: "No team members found",
        data: [],
      });
    }

    const data = await Attendance.findAll({
      where: {
        user_id: {
          [Op.in]: ids,
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json({
      message: "Team attendance fetched",
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const orgAttendance = async (req, res) => {
  try {
    const data = await Attendance.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json({
      message: "Organization attendance fetched",
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = { checkIn, checkOut,myAttendance,teamAttendance,orgAttendance};