import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Task {
  _id: string;
  task: string;
  completed: boolean;
}

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { data } = await axios.post('/api/tasks', { task: newTask });
      setTasks([data, ...tasks]);
      setNewTask('');
      toast.success('Task added');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await axios.put(`/api/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
        <p className="text-gray-400">Keep track of your assignments and deadlines.</p>
      </header>

      <div className="bg-[#14141B] p-6 rounded-3xl border border-white/5 mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Progress</p>
            <p className="text-2xl font-bold">{progress}%</p>
          </div>
          <p className="text-gray-400 text-sm">{completedTasks} of {tasks.length} completed</p>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
          />
        </div>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-4 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-[#14141B] border border-white/5 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors shadow-lg"
        />
        <button
          type="submit"
          disabled={!newTask.trim()}
          className="px-8 py-4 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-[#14141B] rounded-3xl border border-white/5">
            <p className="text-gray-400">No tasks yet. Add one above!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                task.completed 
                  ? 'bg-white/5 border-white/5 opacity-60' 
                  : 'bg-[#14141B] border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleTask(task._id, task.completed)}>
                <button className={`transition-colors ${task.completed ? 'text-purple-500' : 'text-gray-500 hover:text-purple-400'}`}>
                  {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <span className={`text-lg transition-all ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.task}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-4"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
