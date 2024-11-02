const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
  text: { type: String },
  completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  category: { type: String, required: true, default: "To-do" },
  title: { type: String, required: true },
  priority: {
    type: String,
    enum: ["low", "moderate", "high"],
    required: true
  },
  assign: { type: String, default: "" },
  // checklist: [checklistItemSchema],
  // checklist: { type: [String], default: [] },
  checklist: [
    {
      text: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  dueDate: { type: Date }
});

module.exports = mongoose.model("Task", taskSchema);
