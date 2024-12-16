const express = require("express");
require('dotenv').config();
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const mongoose = require("mongoose");
const cors = require("cors");

const DB_URI = "mongodb+srv://udeshya1706:z2kNm7Q4UIcuk7ZR@cluster0.hpsku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const PORT = 8082;

app.use(
  cors({
    origin: "*", // Allow requests from any origin
    optionsSuccessStatus: 200,
    credentials: true, // This won't work with `*`, so remove if using this.
  })
);
mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log("Failed to connect to DB\n", error));

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log("Server Listening at", PORT);
});


