const Vaccine = require('../models/Vaccine');
const Appointment = require('../models/Appointment');
const Child = require('../models/Child');

// Get vaccine schedule for a child
const getVaccineSchedule = async (req, res) => {
  try {
    const childId = req.user.role === 'child' ? req.user.id : req.query.childId;
    
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Calculate age in months
    const ageInMonths = (new Date() - new Date(child.dob)) / (1000 * 60 * 60 * 24 * 30);
    
    // Get vaccines based on age
    const vaccines = await Vaccine.find({
      minAgeMonths: { $lte: ageInMonths },
      maxAgeMonths: { $gte: ageInMonths }
    });

    // Get upcoming appointments
    const appointments = await Appointment.find({ 
      child: childId,
      date: { $gte: new Date() }
    }).populate('vaccine', 'name dose');

    res.status(200).json({ vaccines, appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new vaccine to schedule
const addVaccine = async (req, res) => {
  try {
    const { name, description, minAgeMonths, maxAgeMonths, dose } = req.body;
    
    const vaccine = new Vaccine({
      name,
      description,
      minAgeMonths,
      maxAgeMonths,
      dose
    });

    await vaccine.save();
    res.status(201).json(vaccine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get appointments
const getAppointments = async (req, res) => {
  try {
    const query = {};
    
    if (req.user.role === 'child') {
      query.child = req.user.id;
    } else if (req.user.role === 'vaccinator') {
      query.vaccinator = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate('child', 'name dob')
      .populate('vaccine', 'name dose')
      .populate('vaccinator', 'name hospital');

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { childId, vaccineId, date } = req.body;
    
    const appointment = new Appointment({
      child: childId,
      vaccine: vaccineId,
      vaccinator: req.user.id,
      date
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getVaccineSchedule,
  addVaccine,
  getAppointments,
  createAppointment
};