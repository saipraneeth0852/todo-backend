const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use("/tasks", taskRoutes);

console.log("HEllo");

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in the environment variables.");
    process.exit(1);
}

// Enhanced connection logging
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Add timeout
    socketTimeoutMS: 50000 // Increase socket timeout
})
.then(() => {
    console.log("Connected to MongoDB successfully");
    // Start server after successful DB connection
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
    console.error("MongoDB connection error DETAILS:", err);
    console.error("Connection String Used:", mongoURI);
    process.exit(1); // Exit if cannot connect to DB
});