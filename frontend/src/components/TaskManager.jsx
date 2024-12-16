import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import TaskTable from "./TaskTable";
import TaskModal from "./TaskModal";
import { LoadingIndicator } from "./LoadingIndicator";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { config } from "../App";

export const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let storedUserId = localStorage.getItem('userId');
    console.log(storedUserId);
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${config.endpoint}/tasks?userId=${storedUserId}`);
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddClick = () => {
    setIsEditing(false);
    setTaskData({ title: "", description: "", deadline: "", status: "TODO" });
    setFile(null);
    setOpen(true);
  };

  const handleEditClick = (task) => {
    setIsEditing(true);
    setTaskData(task);
    setFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskData(null);
    setFile(null);
  };

  const handleSave = async () => {
    let userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("deadline", taskData.deadline);
    formData.append("status", taskData.status);
    formData.append("userId", userId);
    if (file) formData.append("pdf", file);
  
    try {
      if (isEditing) {
        await axios.patch(`${config.endpoint}/tasks/${taskData._id}`, {
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
          userId,
        });
      } else {
        await axios.post(`${config.endpoint}/tasks/?userId=${userId}`, formData);
      }
      const response = await axios.get(`${config.endpoint}/tasks?userId=${userId}`);
      setTasks(response.data);
      handleClose();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };
  

  const handleFileChange = (event) => {
    console.log("handleFileChange invoked, event: ", event);
    if (event.target.files.length) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleMarkAsDone = async (taskId) => {
    let storedUserId = localStorage.getItem('userId');
    try {
      await axios.patch(`${config.endpoint}/tasks/${taskId}`, {
        status: "DONE",
      });
      const response = await axios.get(`${config.endpoint}/tasks?userId=${storedUserId}`);
      setTasks(response.data);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDownloadFile = (data, contentType) => {
    const blob = new Blob([data], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-file-${new Date().toLocaleTimeString()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (taskId) => {
    let userId = localStorage.getItem('userId');
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${config.endpoint}/tasks/${taskId}`, {
          data: { userId },
        });
        const response = await axios.get(`${config.endpoint}/tasks?userId=${userId}`);
        setTasks(response.data);
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };
  

  return (
    <div>
      {loading ? (
        <LoadingIndicator />
      ) : tasks.length ? (
        <TaskTable
          tasks={tasks}
          onMarkAsDone={handleMarkAsDone}
          onDownloadFile={handleDownloadFile}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Typography variant="h4" component="h1" gutterBottom>
            No tasks found!
          </Typography>
        </Box>
      )}
      <TaskModal
        open={open}
        handleClose={handleClose}
        taskData={taskData}
        handleChange={(field, value) =>
          setTaskData((prev) => ({ ...prev, [field]: value }))
        }
        handleSave={handleSave}
        handleFileChange={handleFileChange}
        file={file}
        isEditing={isEditing}
      />
      
      <Fab
        aria-label="add"
        color="primary"
        onClick={handleAddClick}
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
    </Fab>
    </div>
  );
};