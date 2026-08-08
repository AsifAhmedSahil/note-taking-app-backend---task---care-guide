const Note = require('../models/Note');

const createNote = async ({ title, content, owner }) => {
  return Note.create({ title, content, owner });
};

const listNotesByOwner = async (ownerId) => {
  return Note.find({ owner: ownerId }).sort({ createdAt: -1 });
};

const listAllNotes = async () => {
  return Note.find().sort({ createdAt: -1 }).populate('owner', 'name email');
};

const getNoteById = async (noteId, ownerId) => {
  return Note.findOne({ _id: noteId, owner: ownerId });
};

const updateNote = async (noteId, ownerId, updates) => {
  return Note.findOneAndUpdate({ _id: noteId, owner: ownerId }, updates, {
    new: true,
    runValidators: true,
  });
};

const deleteNote = async (noteId, ownerId) => {
  return Note.findOneAndDelete({ _id: noteId, owner: ownerId });
};

module.exports = {
  createNote,
  listNotesByOwner,
  listAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};