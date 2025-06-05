"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("books", "created_by_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("authors", "created_by_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("books", "created_by_id");
    await queryInterface.removeColumn("authors", "created_by_id");
  },
};
