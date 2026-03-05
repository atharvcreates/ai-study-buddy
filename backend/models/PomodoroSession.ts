import mongoose from 'mongoose';

const pomodoroSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true }, // in minutes
  date: { type: Date, default: Date.now },
});

export const PomodoroSession = mongoose.model('PomodoroSession', pomodoroSessionSchema);
