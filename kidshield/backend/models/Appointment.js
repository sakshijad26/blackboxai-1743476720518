const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Appointment extends Model {}

Appointment.init({
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'missed'),
    defaultValue: 'scheduled'
  },
  notes: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Appointment',
  timestamps: true
});

// Note: The associations (child, vaccine, vaccinator) will be set up separately
// in the server.js file along with other model associations

module.exports = Appointment;
