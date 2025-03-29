const express = require("express");
const Task = require("../models/Task");
const mongoose = require("mongoose");

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        // Fetch all tasks, sorted by creation date (most recent first)
        const tasks = await Task.find().sort({ createdAt: -1 });
        
        console.log("Fetched tasks:", tasks);
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ 
            error: "Error retrieving tasks", 
            details: error.message 
        });
    }
})

router.post("/", async (req, res) => {
    try {
        console.log("Received task creation request:", req.body);

        // Validate required fields
        const { title, description, completed } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // Create new task with all provided fields
        const newTask = new Task({
            title,
            description: description || '',
            completed: completed || false
        });

        // Save task
        const savedTask = await newTask.save();
        
        console.log("Task created successfully:", savedTask);
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("Task creation error:", err);
        res.status(500).json({ 
            error: "Error Creating Task", 
            details: err.message 
        });
    }
});


router.put("/:id", async (req, res) => {
    try {
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        // Extract fields to update
        const { title, description, completed } = req.body;

        // Prepare update object with only provided fields
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (completed !== undefined) updateFields.completed = completed;

        // Perform update
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            updateFields, 
            { 
                new: true,     // Return updated document
                runValidators: true  // Run model validations
            }
        );

        // Check if task was found and updated
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ 
            error: "Error updating task", 
            details: error.message 
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        // Attempt to delete
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        // Check if task was found and deleted
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ 
            message: "Task Deleted", 
            deletedTask: deletedTask 
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ 
            error: "Error deleting task", 
            details: error.message 
        });
    }
});

module.exports = router;