const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Vaccine extends Model {}

Vaccine.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.STRING,
  minAgeMonths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxAgeMonths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dose: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Vaccine',
  timestamps: true
});

module.exports = Vaccine;
