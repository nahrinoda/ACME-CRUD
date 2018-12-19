const mongoose = require("mongoose");
const unique = require("mongoose-unique-validator");
const validate = require("mongoose-validator");

const deviceNameValidator = [
  validate({
    validator: "isLength",
    arguments: [0, 40],
    message: "Device name must not exceed {ARGS[1]} characters."
  })
];

const deviceTypeValidator = [
  validate({
    validator: "isLength",
    arguments: [0, 40],
    message: "Device type must not exceed {ARGS[1]} characters."
  })
];

const sensorNameValidator = [
  // TODO: Make some validations here...
];

const deviceStatusValidator = [
  // TODO: Make some validations here...
];

// Define the database model
const UserSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: [true, "Device name is required."]
  },
  deviceType: {
    type: String,
    required: [true, "Device Type is required."],
    unique: true
  },
  sensorName: {
    type: String
  },
  dStatus: {
    type: String
  }
});

// Use the unique validator plugin
UserSchema.plugin(unique, { message: "That {PATH} is already taken." });

const User = (module.exports = mongoose.model("user", UserSchema));
