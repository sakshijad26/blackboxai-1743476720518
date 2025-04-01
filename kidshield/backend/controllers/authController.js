const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Child = require('../models/Child');
const Vaccinator = require('../models/Vaccinator');

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Register child with OTP
const registerChild = async (req, res) => {
  try {
    const { name, dob, parentName, phoneNumber } = req.body;
    
    // Generate and save OTP (in production, send via SMS)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    
    const child = new Child({
      name,
      dob,
      parentName,
      phoneNumber,
      otp,
      otpExpiry
    });

    await child.save();
    
    // In production: Send OTP via SMS
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    res.status(201).json({ 
      message: 'OTP sent to registered mobile number',
      tempId: child._id // Temporary ID for OTP verification
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify OTP and complete registration
const verifyOTP = async (req, res) => {
  try {
    const { tempId, otp } = req.body;
    const child = await Child.findById(tempId);
    
    if (!child) {
      return res.status(404).json({ message: 'Child record not found' });
    }
    
    if (child.otp !== otp || child.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Clear OTP fields
    child.otp = undefined;
    child.otpExpiry = undefined;
    await child.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: child._id, role: 'child' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register vaccinator
const registerVaccinator = async (req, res) => {
  try {
    const { name, email, password, hospital } = req.body;
    
    // Check if vaccinator exists
    const existingVaccinator = await Vaccinator.findOne({ email });
    if (existingVaccinator) {
      return res.status(400).json({ message: 'Vaccinator already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const vaccinator = new Vaccinator({
      name,
      email,
      password: hashedPassword,
      hospital
    });
    
    await vaccinator.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: vaccinator._id, role: 'vaccinator' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login for all roles
const login = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;
    
    // For vaccinator login
    if (email) {
      const vaccinator = await Vaccinator.findOne({ email });
      if (!vaccinator) {
        return res.status(404).json({ message: 'Vaccinator not found' });
      }
      
      const isMatch = await bcrypt.compare(password, vaccinator.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: vaccinator._id, role: 'vaccinator' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      return res.status(200).json({ token });
    }
    
    // For parent login (using phone number)
    if (phoneNumber) {
      const child = await Child.findOne({ phoneNumber });
      if (!child) {
        return res.status(404).json({ message: 'Child not found' });
      }
      
      // Generate and send OTP
      const otp = generateOTP();
      child.otp = otp;
      child.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await child.save();
      
      // In production: Send OTP via SMS
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      
      return res.status(200).json({ 
        message: 'OTP sent to registered mobile number',
        tempId: child._id
      });
    }
    
    res.status(400).json({ message: 'Invalid login method' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerChild,
  verifyOTP,
  registerVaccinator,
  login
};