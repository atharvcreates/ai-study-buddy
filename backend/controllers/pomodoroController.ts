import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { PomodoroSession } from '../models/PomodoroSession.js';

export const saveSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { duration } = req.body;
    const session = await PomodoroSession.create({ duration, userId: req.user._id });
    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await PomodoroSession.find({ userId: req.user._id });
    
    // Calculate total study hours
    const totalMinutes = sessions.reduce((acc, session) => acc + session.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    // Calculate weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklySessions = sessions.filter(s => new Date(s.date) >= oneWeekAgo);
    
    // Group by day for chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = days.map(day => ({ name: day, hours: 0 }));
    
    weeklySessions.forEach(session => {
      const dayIndex = new Date(session.date).getDay();
      weeklyData[dayIndex].hours += session.duration / 60;
    });
    
    // Format hours to 1 decimal place
    weeklyData.forEach(day => {
      day.hours = parseFloat(day.hours.toFixed(1));
    });

    res.json({
      totalHours,
      totalSessions: sessions.length,
      weeklyData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
