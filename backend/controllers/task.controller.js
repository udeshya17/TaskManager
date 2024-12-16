const TaskService = require("../services/task.service");

const TaskServiceInstance = new TaskService();

const getTasks = async (req, res) => {
  try {
    const { userId } = req.query; 
    const tasks = await TaskServiceInstance.find(userId);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, userId } = req.body;

    const linkedFile = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;

    const newTask = await TaskServiceInstance.create({
      title,
      description,
      deadline,
      linkedFile,
      userId, 
    });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...updates } = req.body;

    // Ensure only tasks belonging to the user are updated
    const task = await TaskServiceInstance.find(userId);
    if (!task) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    const result = await TaskServiceInstance.update(id, updates);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await TaskServiceInstance.delete(id);
    res.status(204).send(deletedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
