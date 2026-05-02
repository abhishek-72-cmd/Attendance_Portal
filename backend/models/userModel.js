const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
  },

  role: {
    type: DataTypes.ENUM("EMPLOYEE", "MANAGER", "HR"),
  },

  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = User;