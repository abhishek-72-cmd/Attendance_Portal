const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const LeaveType = sequelize.define("LeaveType", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quota: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


module.exports = LeaveType;