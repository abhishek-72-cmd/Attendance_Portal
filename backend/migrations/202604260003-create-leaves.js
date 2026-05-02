"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Leaves", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: Sequelize.INTEGER,
      leave_type_id: Sequelize.INTEGER,
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      reason: Sequelize.STRING,
      status: { type: Sequelize.STRING, defaultValue: "PENDING" },
      remark: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Leaves");
  },
};