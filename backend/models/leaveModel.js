const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Leave = sequelize.define("Leave", {
  user_id: DataTypes.INTEGER,
  leave_type: DataTypes.STRING,
  start_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY,
  reason: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
  },
  remark: DataTypes.STRING,
});

module.exports = Leave;