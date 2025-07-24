"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add a new array column
    await queryInterface.addColumn("SwapRequests", "toClassNos", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });

    // Step 2: Copy over existing string values into the array column
    await queryInterface.sequelize.query(`
      UPDATE "SwapRequests"
      SET "toClassNos" = ARRAY["toClassNo"]
    `);

    // Step 3: Drop the old string column
    await queryInterface.removeColumn("SwapRequests", "toClassNo");
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Recreate string column
    await queryInterface.addColumn("SwapRequests", "toClassNo", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });

    // Step 2: Restore the first value of the array
    await queryInterface.sequelize.query(`
      UPDATE "SwapRequests"
      SET "toClassNo" = "toClassNos"[1]
    `);

    // Step 3: Drop the array column
    await queryInterface.removeColumn("SwapRequests", "toClassNos");
  },
};
