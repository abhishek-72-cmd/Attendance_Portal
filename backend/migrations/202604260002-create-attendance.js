"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Attendances", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: Sequelize.INTEGER,
      date: Sequelize.DATEONLY,
      check_in: Sequelize.DATE,
      check_out: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Attendances");
  },
};