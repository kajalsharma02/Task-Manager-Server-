const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true
  },
  email: {
    type: "string",
    required: true
  },
  password: {
    type: "string",
    required: true
  },
  date: {
    type: Date,
    dafault: Date.now()
  }
});

module.exports = mongoose.model("User", userSchema);
