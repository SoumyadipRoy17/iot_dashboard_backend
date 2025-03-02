require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema & Model for AccessLogs
const accessLogSchema = new mongoose.Schema({
  timestamp: Date,
  status: String,
  registered_user: String,
});

const AccessLog = mongoose.model("AccessLog", accessLogSchema, "AccessLogs"); // Explicitly defining collection name

// API Route to Fetch Data
app.get("/api/data", async (req, res) => {
  try {
    const data = await AccessLog.find().sort({ timestamp: -1 }); // Fetch latest first
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
