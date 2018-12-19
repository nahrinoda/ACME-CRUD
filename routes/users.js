const express = require('express');
const router = express.Router();
const RateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const stringCapitalizeName = require('string-capitalize-name');

const User = require('../models/user');

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs 
  delayMs: 0, // Disable delaying - full speed until the max limit is reached 
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

// READ (ONE)
router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such user.` });
    });
});

// READ (ALL)
router.get('/', (req, res) => {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE
router.post('/', postLimiter, (req, res) => {

  // Validate the age
  let age = sanitizeAge(req.body.age);
  if (age < 5 && age != '') return res.status(403).json({ success: false, msg: `You're too young for this.` });
  else if (age > 130 && age != '') return res.status(403).json({ success: false, msg: `You're too old for this.` });

  let newUser = new User({
    deviceName: sanitizeName(req.body.deviceName),
    deviceType: sanitizeEmail(req.body.deviceType),
    sensorName: sanitizeAge(sensorName),
    dStatus: sanitizeGender(req.body.dStatus)
  });

  newUser.save()
    .then((result) => {
      res.json({
        success: true,
        msg: `Successfully added!`,
        result: {
          _id: result._id,
          deviceName: result.deviceName,
          deviceType: result.deviceType,
          sensorName: result.sensorName,
          dStatus: result.dStatus
        }
      });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.deviceName) {
          res.status(400).json({ success: false, msg: err.errors.deviceName.message });
          return;
        }
        if (err.errors.deviceType) {
          res.status(400).json({ success: false, msg: err.errors.deviceType.message });
          return;
        }
        if (err.errors.sensorName) {
          res.status(400).json({ success: false, msg: err.errors.sensorName.message });
          return;
        }
        if (err.errors.dStatus) {
          res.status(400).json({ success: false, msg: err.errors.dStatus.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// UPDATE
router.put('/:id', (req, res) => {

  let updatedUser = {
    deviceName: sanitizedeviceName(req.body.deviceName),
    deviceType: sanitizedeviceType(req.body.deviceType),
    sensorName: sanitizesensorName(req.body.sensorName),
    dStatus: sanitizedStatus(req.body.dStatus)
  };

  User.findOneAndUpdate({ _id: req.params.id }, updatedUser, { runValidators: true, context: 'query' })
    .then((oldResult) => {
      User.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              deviceName: newResult.deviceName,
              deviceType: newResult.deviceType,
              sensorName: newResult.sensorName,
              dStatus: newResult.dStatus
            }
          });
        })
        .catch((err) => {
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.deviceName) {
          res.status(400).json({ success: false, msg: err.errors.deviceName.message });
          return;
        }
        if (err.errors.deviceType) {
          res.status(400).json({ success: false, msg: err.errors.deviceType.message });
          return;
        }
        if (err.errors.sensorName) {
          res.status(400).json({ success: false, msg: err.errors.sensorName.message });
          return;
        }
        if (err.errors.dStatus) {
          res.status(400).json({ success: false, msg: err.errors.dStatus.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

// DELETE
router.delete('/:id', (req, res) => {

  User.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          deviceName: result.deviceName,
          deviceType: result.deviceType,
          sensorName: result.sensorName,
          dStatus: result.dStatus
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

module.exports = router;

// Minor sanitizing to be invoked before reaching the database
sanitizeName = (deviceName) => {
  return stringCapitalizeName(deviceName);
}
sanitizeEmail = (deviceName) => {
  return deviceName.toLowerCase();
}

sanitizeEmail = (sensorName) => {
  return sensorName.toLowerCase();
} 

sanitizeGender = (dStatus) => {
  // Return empty if it's neither of the two
  return (dStatus === 'ON' || dStatus === 'OFF') ? dStatus : 'UNAV';
}
