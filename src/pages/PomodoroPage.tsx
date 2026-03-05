import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const PomodoroPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: any = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        // Study session finished
        setSessionsCompleted(s => s + 1);
        saveSession(25);
        toast.success('Study session completed! Time for a break.');
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        // Break finished
        toast.success('Break over! Ready to study?');
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const saveSession = async (duration: number) => {
    try {
      await axios.post('/api/pomodoro/session', { duration });
    } catch (error) {
      console.error('Failed to save session', error);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Pomodoro Timer</h1>
        <p className="text-gray-400">Stay focused and track your study sessions.</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center mb-12">
        {/* Circular Progress */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="160"
            cy="160"
            r="150"
            stroke={isBreak ? "#10B981" : "#A855F7"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 150}
            strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="text-center z-10">
          <p className={`text-xl font-medium mb-2 ${isBreak ? 'text-green-400' : 'text-purple-400'}`}>
            {isBreak ? 'Break Time' : 'Study Time'}
          </p>
          <h2 className="text-7xl font-bold font-mono tracking-tighter">
            {formatTime(timeLeft)}
          </h2>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
            isActive 
              ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
              : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
          }`}
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-16 h-16 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all"
        >
          <RotateCcw className="w-7 h-7" />
        </button>
      </div>

      <div className="mt-12 bg-[#14141B] px-8 py-4 rounded-2xl border border-white/5">
        <p className="text-gray-400">Sessions completed today: <span className="text-white font-bold text-xl ml-2">{sessionsCompleted}</span></p>
      </div>
    </motion.div>
  );
};
