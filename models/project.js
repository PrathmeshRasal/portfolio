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
  image: {
    type: DataTypes.STRING,  // Ensure this field exists to store the image path
    allowNull: true,
  }
}, {
  // Other model options
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

module.exports = Project;
