import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Target, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AnalyticsPage = () => {
  const [stats, setStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    weeklyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/pomodoro/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Study Hours', value: `${stats.totalHours}h`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Pomodoro Sessions', value: stats.totalSessions, icon: Target, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Productivity Score', value: '85%', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'Current Streak', value: '5 Days', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">Track your study habits and productivity over time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#14141B] p-6 rounded-3xl border border-white/5 flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={`w-7 h-7 ${card.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <p className="text-3xl font-bold">{loading ? '-' : card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#14141B] p-8 rounded-3xl border border-white/5 h-[500px]">
        <h2 className="text-xl font-bold mb-8">Weekly Study Hours</h2>
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">Loading chart data...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff50" tick={{ fill: '#ffffff50' }} />
              <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50' }} />
              <Tooltip
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ backgroundColor: '#14141B', borderColor: '#ffffff10', borderRadius: '12px' }}
              />
              <Bar dataKey="hours" fill="#A855F7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};
