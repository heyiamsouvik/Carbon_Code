require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");  // npm i helmet morgan
const connectDB = require("./config/db");

const app = express();
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
connectDB();

const analyzeRoutes = require("./routes/analyze.routes");
app.use("/api", analyzeRoutes);
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;
