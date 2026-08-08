import Note from '../models/Note.js';

const createNote = async ({ title, content, owner }) => {
  return Note.create({ title, content, owner });
};

const listNotesByOwner = async ({ ownerId, page, limit, skip }) => {
  const filter = { owner: ownerId };
  const total = await Note.countDocuments(filter);
  const notes = await Note.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return { notes, total };
};

const listAllNotes = async ({ page, limit, skip }) => {
  const filter = {};
  const total = await Note.countDocuments(filter);
  const notes = await Note.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('owner', 'name email');
  return { notes, total };
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

export {
  createNote,
  listNotesByOwner,
  listAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};