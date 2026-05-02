'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
const model = require(path.join(__dirname, file));
db[model.name] = model;
  });

// Existing associate hook
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// ✅ ✅ ADD THIS BLOCK (IMPORTANT FIX)

// Attendance ↔ User
if (db.User && db.Attendance) {
  db.User.hasMany(db.Attendance, { foreignKey: "user_id" });
  db.Attendance.belongsTo(db.User, { foreignKey: "user_id" });
}

// (optional but recommended)
if (db.Leave && db.User) {
  db.Leave.belongsTo(db.User, { foreignKey: "user_id" });
}

// (future use if you created LeaveType)
if (db.Leave && db.LeaveType) {
  db.Leave.belongsTo(db.LeaveType, { foreignKey: "leave_type_id" });
  db.LeaveType.hasMany(db.Leave, { foreignKey: "leave_type_id" });
}


// ✅ END ADDITION

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;