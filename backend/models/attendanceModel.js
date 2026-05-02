const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Attendance = sequelize.define("Attendance", {
  user_id: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  check_in: {
    type: DataTypes.DATE,
  },
  check_out: {
    type: DataTypes.DATE,
  },
});

module.exports = Attendance;