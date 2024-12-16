const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["TODO", "DONE"], default: "TODO" },
  linkedFile: {
    data: Buffer,
    contentType: String,
  },
  deadline: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, 
},
  { timestamps: true }
);

const Task = mongoose.model("Tasks", taskSchema);

module.exports = Task;
