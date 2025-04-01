require('dotenv').config();
const path = require('path');
const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');

// Import models
const Child = require('./models/Child');
const Vaccine = require('./models/Vaccine');
const Vaccinator = require('./models/Vaccinator');
const Appointment = require('./models/Appointment');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve all static files from frontend dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Set up model associations
Child.belongsToMany(Vaccine, { through: 'ChildVaccines' });
Vaccine.belongsToMany(Child, { through: 'ChildVaccines' });

Appointment.belongsTo(Child);
Child.hasMany(Appointment);

Appointment.belongsTo(Vaccine);
Vaccine.hasMany(Appointment);

Appointment.belongsTo(Vaccinator);
Vaccinator.hasMany(Appointment);

// Test database connection and sync models
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vaccines', vaccineRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
