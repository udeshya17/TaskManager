import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { config } from "../App";

// Helper function to calculate time left in hours
const calculateTimeLeft = (deadline) => {
  const currentTime = new Date();
  const taskDeadline = new Date(deadline);
  const timeLeftMs = taskDeadline - currentTime;

  if (timeLeftMs <= 0) return "Time's up";

  const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60)); // Convert milliseconds to hours
  return `${hoursLeft} hours left`;
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [expiredTasks, setExpiredTasks] = useState(0);  // Track expired tasks
  const [pendingTasksDetails, setPendingTasksDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${config.endpoint}/tasks`); 
        setTasks(response.data);

        // Calculate task statuses
        const completed = response.data.filter(task => task.status === "DONE").length;
        const pending = response.data.filter(task => task.status === "TODO").length;

        // Calculate expired tasks based on deadline and created_at
        const expired = response.data.filter(task => {
          const currentTime = new Date();
          const taskDeadline = new Date(task.deadline);
          const taskCreatedAt = new Date(task.createdAt);

          // If the task deadline has passed and the task is created before the current time, it's expired
          return taskDeadline <= currentTime && taskCreatedAt <= currentTime;
        }).length;

        setCompletedTasks(completed);
        setPendingTasks(pending);
        setExpiredTasks(expired);

        // Get details for pending tasks
        const pendingTasks = response.data.filter(task => task.status === "TODO");
        setPendingTasksDetails(pendingTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Box */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              Task Summary
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Total Tasks: {tasks.length}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Completed Tasks: {completedTasks} ({((completedTasks / tasks.length) * 100).toFixed(2)}%)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Pending Tasks: {pendingTasks} ({((pendingTasks / tasks.length) * 100).toFixed(2)}%)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Expired Tasks: {expiredTasks} ({((expiredTasks / tasks.length) * 100).toFixed(2)}%)
            </Typography>
          </Paper>
        </Grid>

        {/* Pending Tasks Box */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              Pending Tasks & Time Left
            </Typography>
            {pendingTasksDetails.length > 0 ? (
              pendingTasksDetails.map((task, index) => (
                <Box key={task._id} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    Task: {task.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                    Time Left: {task.deadline ? calculateTimeLeft(task.deadline) : "No time left available"}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                No pending tasks
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
