import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('/api/notes');
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentNote.title || !currentNote.content) {
      return toast.error('Title and content are required');
    }

    try {
      if (currentNote._id) {
        await axios.put(`/api/notes/${currentNote._id}`, currentNote);
        toast.success('Note updated');
      } else {
        await axios.post('/api/notes', currentNote);
        toast.success('Note created');
      }
      setIsEditing(false);
      fetchNotes();
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${id}`);
      toast.success('Note deleted');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const openEditor = (note?: Note) => {
    if (note) {
      setCurrentNote(note);
    } else {
      setCurrentNote({ title: '', content: '' });
    }
    setIsEditing(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
          <p className="text-gray-400">Organize your thoughts and study materials.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => openEditor()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>
        )}
      </header>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#14141B] p-8 rounded-3xl border border-white/5 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              placeholder="Note Title"
              className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-white w-full placeholder-gray-600"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
          <textarea
            value={currentNote.content}
            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            placeholder="Start typing your notes here..."
            className="w-full h-96 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-300 resize-none placeholder-gray-600"
          />
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-400">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#14141B] rounded-3xl border border-white/5">
              <p className="text-gray-400 mb-4">You haven't created any notes yet.</p>
              <button
                onClick={() => openEditor()}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Create your first note
              </button>
            </div>
          ) : (
            notes.map((note) => (
              <motion.div
                key={note._id}
                whileHover={{ y: -5 }}
                className="bg-[#14141B] p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group flex flex-col h-64"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold truncate pr-4">{note.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditor(note)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm flex-1 overflow-hidden line-clamp-6">
                  {note.content}
                </p>
                <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-white/5">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};
