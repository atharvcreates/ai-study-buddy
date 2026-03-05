import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Task } from '../models/Task.js';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { task } = req.body;
    const newTask = await Task.create({ task, userId: req.user._id });
    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { task, completed } = req.body;
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (existingTask.userId.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    if (task !== undefined) existingTask.task = task;
    if (completed !== undefined) existingTask.completed = completed;
    
    const updatedTask = await existingTask.save();
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
