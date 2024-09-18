const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Projects', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // Other model options
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = Project;
