const mongoose = require("mongoose");

const AnalysisHistorySchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  language: String,
  code: String,
  analysis: Object,
  fixedCode: {
  type: String,
  required: true
},
fixEngine: {
  type: String,
  enum: ["groq", "gemini", "fallback"],
  required: true
},
fixStatus: {
  type: String,
  default: "success"
},
  createdAt: { type: Date, default: Date.now }
});


AnalysisHistorySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 604800 }
);

module.exports = mongoose.model("AnalysisHistory", AnalysisHistorySchema);
