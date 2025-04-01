const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Child extends Model {}

Child.init({
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  dob: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  parentName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phoneNumber: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true 
  },
  otp: DataTypes.STRING,
  otpExpiry: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Child',
  timestamps: true
});

module.exports = Child;
