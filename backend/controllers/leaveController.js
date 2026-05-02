const Leave = require("../models/leaveModel");
const LeaveType = require('../models/leaveTypeModel')
const { Op } = require("sequelize");
const User = require("../models/userModel"); // ✅ ADD THIS

Leave.belongsTo(LeaveType, { foreignKey: "leave_type_id" });
LeaveType.hasMany(Leave, { foreignKey: "leave_type_id" });

Leave.belongsTo(User, { foreignKey: "user_id" });


const applyLeave = async (req, res) => {
  try {
    const { leave_type_id, start_date, end_date, reason } = req.body;
    const userId = req.user.id;

    // 🔹 1. DATE VALIDATION
    const start = new Date(start_date);
    const end = new Date(end_date);
    const today = new Date();

    if (start > end) {
      return res.status(400).json({
        message: "Start date cannot be after end date",
      });
    }

    if (start < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        message: "Cannot apply leave for past dates",
      });
    }

    // 🔹 2. CHECK LEAVE TYPE EXISTS
    const leaveType = await LeaveType.findByPk(leave_type_id);

    if (!leaveType) {
      return res.status(404).json({
        message: "Invalid leave type",
      });
    }

    // 🔹 3. OVERLAPPING CHECK
    const overlapping = await Leave.findOne({
      where: {
        user_id: userId,
        status: {
          [Op.ne]: "REJECTED",
        },
        [Op.or]: [
          {
            start_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          {
            end_date: {
              [Op.between]: [start_date, end_date],
            },
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        message: "You already have a leave in this date range",
      });
    }

    // 🔹 4. QUOTA CHECK
    const totalLeaves = await Leave.count({
      where: {
        user_id: userId,
        leave_type_id,
        status: "APPROVED",
      },
    });


    const requestedDays =
      (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24) + 1;

    if (totalLeaves + requestedDays > leaveType.quota) {
      return res.status(400).json({
        message: "Leave quota exceeded",
      });
    }

    // ✅ CREATE LEAVE
    const leave = await Leave.create({
      user_id: userId,
      leave_type_id,
       leave_type: leaveType.name, 
      start_date,
      end_date,
      reason,
    });

    res.json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const myLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: LeaveType,
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    const leave = await Leave.findByPk(id);


if (leave.status !== "PENDING") {
  return res.status(400).json({
    message: "Leave already processed",
  });
}

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // ❗ Manager cannot approve own leave
    if (leave.user_id === req.user.id) {
      return res.status(400).json({
        message: "You cannot approve your own leave",
      });
    }

    // 🔥 Fetch employee who applied leave
    const employee = await User.findByPk(leave.user_id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 🚨 MAIN CHECK: Is this employee under this manager?
    if (employee.manager_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only approve leave of your team members",
      });
    }

    // ✅ Update leave
    leave.status = status;
    leave.remark = remark;

    await leave.save();

    res.json({
      message: "Leave updated successfully",
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// HR creates leave type
const createLeaveType = async (req, res) => {
  try {
    const { name, quota } = req.body;

    const leave = await LeaveType.create({
      name,
      quota,
    });

    res.json({
      message: "Leave type created",
      data: leave,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// update quota
const updateLeaveType = async (req, res) => {
  try {
    if (req.user.role !== "HR") {
      return res.status(403).json({ message: "Only HR can update leave types" });
    }

    const { id } = req.params;
    const { name, quota } = req.body;

    const leaveType = await LeaveType.findByPk(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    // ✅ update only if provided
    if (name !== undefined) leaveType.name = name;
    if (quota !== undefined) leaveType.quota = quota;

    await leaveType.save();

    res.json({
      message: "Leave type updated",
      data: leaveType,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getPendingLeaves = async (req, res) => {
  try {
    const team = await User.findAll({
      where: { manager_id: req.user.id },
    });

    const ids = team.map((u) => u.id);

    const leaves = await Leave.findAll({
      where: {
        user_id: {
          [Op.in]: ids,
        },
        status: "PENDING",
      },
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


    // Hr view all leave req
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [
        {
          model: LeaveType,
          attributes: ["id", "name"],
        },
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getLeaveTypes = async (req, res) => {
  try {
    const data = await LeaveType.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Leave types fetched",
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const pendingLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let where = { status: "PENDING" };

    if (role === "MANAGER") {
      const team = await User.findAll({
        where: { manager_id: userId },
      });

      const ids = team.map((u) => u.id);

      where.user_id = {
        [Op.in]: ids.length ? ids : [0], // avoid empty IN
      };
    }

    // HR → no extra filter (sees all pending)

    const leaves = await Leave.findAll({
      where,
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: LeaveType, attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    // IMPORTANT: return array directly
    res.json(leaves);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { applyLeave, myLeaves,approveLeave,createLeaveType,updateLeaveType,getPendingLeaves,getAllLeaves,getLeaveTypes, pendingLeaves };