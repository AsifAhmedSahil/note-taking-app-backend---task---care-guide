const noteService = require('../services/noteService');
const { getPaginationParams } = require('../utils/pagination');

const sanitizeNote = (note) => ({
  id: note._id,
  title: note.title,
  content: note.content,
  owner: note.owner,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const note = await noteService.createNote({
      title,
      content,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      note: sanitizeNote(note),
    });
  } catch (err) {
    next(err);
  }
};

const listMyNotes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { notes, total } = await noteService.listNotesByOwner({
      ownerId: req.user.id,
      page,
      limit,
      skip,
    });
    res.status(200).json({
      success: true,
      data: notes.map(sanitizeNote),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getMyNote = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }
    res.status(200).json({
      success: true,
      note: sanitizeNote(note),
    });
  } catch (err) {
    next(err);
  }
};

const updateMyNote = async (req, res, next) => {
  try {
    const allowedFields = ['title', 'content'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const note = await noteService.updateNote(
      req.params.id,
      req.user.id,
      updates
    );
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    res.status(200).json({
      success: true,
      note: sanitizeNote(note),
    });
  } catch (err) {
    next(err);
  }
};

const deleteMyNote = async (req, res, next) => {
  try {
    const note = await noteService.deleteNote(req.params.id, req.user.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Note deleted.',
    });
  } catch (err) {
    next(err);
  }
};

const listAllNotes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { notes, total } = await noteService.listAllNotes({
      page,
      limit,
      skip,
    });
    res.status(200).json({
      success: true,
      data: notes.map(sanitizeNote),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNote,
  listMyNotes,
  getMyNote,
  updateMyNote,
  deleteMyNote,
  listAllNotes,
};