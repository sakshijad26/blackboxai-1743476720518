const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Child registration with OTP
router.post('/register/child', authController.registerChild);
router.post('/verify/otp', authController.verifyOTP);

// Vaccinator registration
router.post('/register/vaccinator', authController.registerVaccinator);

// Login for both roles
router.post('/login', authController.login);

module.exports = router;