#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Please provide a name for the migration.");
  process.exit(1);
}

const name = args[0];
const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const fileName = `${timestamp}-${name}.cjs`;

const migrationsDir = path.resolve("dist/db/migrations");
const filePath = path.join(migrationsDir, fileName);

const template = `\
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // TODO: Add migration code here
  },

  async down(queryInterface, Sequelize) {
    // TODO: Add revert code here
  },
};
`;

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir);
}

fs.writeFileSync(filePath, template);
console.log("✅ Migration created:", fileName);
