const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all vaccine routes
router.use(authMiddleware.verifyToken);

// Vaccine schedule routes
router.get('/', vaccineController.getVaccineSchedule);
router.post('/', vaccineController.addVaccine);

// Appointment routes
router.get('/appointments', vaccineController.getAppointments);
router.post('/appointments', vaccineController.createAppointment);

module.exports = router;