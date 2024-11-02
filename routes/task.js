const express = require("express");
const router = express.Router();
const taskSchema = require("../schema/task.schema");
const authMiddleware = require("../middleware/auth");

// Creating a Task
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const taskInfo = req.body;
    console.log(taskInfo);
    const user = req.user;
    taskInfo.userId = user._id;
    const task = new taskSchema(taskInfo);
    task
      .save()
      .then(() => {
        res.status(200).json(task);
      })
      .catch((e) => {
        next(e);
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error creating task" });
    next(e);
  }
});

// Route to get all tasks
router.get("/", async (req, res, next) => {
  try {
    const tasks = await taskSchema.find();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

//To update all the tasks
router.patch("/:id", authMiddleware, async (req, res, next) => {
  try {
    const id = req.params.id;
    const task = await taskSchema.findById(id);
    // console.log(task)

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskInfo = req.body;
    console.log(taskInfo);

    // Update the task and handle potential validation errors
    const updatedTask = await taskSchema.findByIdAndUpdate(id, taskInfo, {
      runValidators: true,
      new: true
    });

    if (!updatedTask) {
      return res.status(400).json({ message: "Failed to update task" });
    }

    res.status(200).json(updatedTask);
  } catch (e) {
    console.error("Error updating task:", e.message, e);
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

//  Deleting a task
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const task = await taskSchema.findById(id);
    console.log(task);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("Fetched Tasks: ", task);

    // const taskCreator = task.userId.toString();
    // const user = req.user._id.toString();

    // console.log(taskCreator, user);

    await taskSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
