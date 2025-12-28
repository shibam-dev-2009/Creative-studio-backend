const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  class: Number,
  subject: String,
  type: String,
  filePath: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Note", noteSchema);
