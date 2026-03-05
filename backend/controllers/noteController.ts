import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Note } from '../models/Note.js';

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, userId: req.user._id });
    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    note.title = title || note.title;
    note.content = content || note.content;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
