const mongoose = require( 'mongoose' );

const WeeklyReportSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    buffer: { type: Buffer }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeeklyReport', WeeklyReportSchema);
