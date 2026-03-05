import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageSquare, Timer, FileText, CheckSquare, FileUp, BarChart2 } from 'lucide-react';

const features = [
  { title: 'AI Chat Tutor', icon: MessageSquare, desc: 'Get instant help with complex topics using our advanced AI.' },
  { title: 'Pomodoro Timer', icon: Timer, desc: 'Stay focused with customizable study and break intervals.' },
  { title: 'Study Notes', icon: FileText, desc: 'Organize your thoughts and study materials in one place.' },
  { title: 'Task Manager', icon: CheckSquare, desc: 'Keep track of assignments and deadlines efficiently.' },
  { title: 'PDF Explainer', icon: FileUp, desc: 'Upload documents and let AI summarize key concepts.' },
  { title: 'Productivity Tracker', icon: BarChart2, desc: 'Visualize your study habits and track progress over time.' },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[150px]" />

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
          AI Study Buddy
        </h1>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 rounded-full font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/signup" className="px-6 py-2 rounded-full font-medium bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Innovating Tomorrow. <br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
              Building Today.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-10"
          >
            Your all-in-one AI-powered study companion. Master subjects faster, stay focused longer, and track your success.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-6"
          >
            <Link to="/signup" className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105">
              Start Studying Free
            </Link>
            <a href="#features" className="px-8 py-4 rounded-full font-bold text-lg bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all">
              See Features
            </a>
          </motion.div>
        </div>

        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#14141B] p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
