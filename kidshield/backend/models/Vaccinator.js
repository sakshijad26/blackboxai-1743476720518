const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Vaccinator extends Model {}

Vaccinator.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hospital: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Vaccinator',
  timestamps: true
});

// Note: The appointments association will be set up separately
// in the server.js file along with other model associations

module.exports = Vaccinator;
