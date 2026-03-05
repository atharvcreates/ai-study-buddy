import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'motion/react';
import { MessageSquare, Timer, FileText, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalHours: 0, tasksCompleted: 0, notesCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pomodoroRes, tasksRes, notesRes] = await Promise.all([
          axios.get('/api/pomodoro/stats'),
          axios.get('/api/tasks'),
          axios.get('/api/notes')
        ]);
        
        setStats({
          totalHours: pomodoroRes.data.totalHours || 0,
          tasksCompleted: tasksRes.data.filter((t: any) => t.completed).length,
          notesCount: notesRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const cards = [
    { title: 'AI Chat', icon: MessageSquare, path: '/chat', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Pomodoro', icon: Timer, path: '/pomodoro', color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Notes', icon: FileText, path: '/notes', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'Tasks', icon: CheckSquare, path: '/tasks', color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-400">Ready to crush your study goals today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#14141B] p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Timer className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Study Hours</p>
            <p className="text-2xl font-bold">{stats.totalHours}h</p>
          </div>
        </div>
        <div className="bg-[#14141B] p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Tasks Completed</p>
            <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
          </div>
        </div>
        <div className="bg-[#14141B] p-6 rounded-3xl border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Notes Saved</p>
            <p className="text-2xl font-bold">{stats.notesCount}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Link key={card.title} to={card.path}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#14141B] p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group h-full"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${card.bg}`}>
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">{card.title}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
