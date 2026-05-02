"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      password: Sequelize.STRING,
      role: Sequelize.STRING,
      manager_id: Sequelize.INTEGER,
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};