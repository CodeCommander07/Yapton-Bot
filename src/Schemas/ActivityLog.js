const mongoose = require( 'mongoose' );


const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeJoined: { type: String, required: true },
  timeLeft: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },  // <-- this must be included!
  notable: { type: String, enum: ['Yes', 'No'], default: 'No' },
  host: { type: String },
  participants: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
