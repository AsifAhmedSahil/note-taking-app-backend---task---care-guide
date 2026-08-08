import mongoose from 'mongoose';

import * as noteService from '../services/noteService.js';
import { getPaginationParams } from '../utils/pagination.js';
import { isNonEmptyString } from '../utils/validate.js';

const sanitizeNote = (note) => ({
  id: note._id,
  title: note.title,
  content: note.content,
  owner: note.owner,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});

const isValidNoteId = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid note id.',
    });
    return false;
  }
  return true;
};

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
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
    if (!isValidNoteId(req, res)) return;
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
    if (!isValidNoteId(req, res)) return;
    const allowedFields = ['title', 'content'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.title !== undefined && !isNonEmptyString(updates.title)) {
      return res.status(400).json({
        success: false,
        message: 'Title must be a non-empty string.',
      });
    }
    if (updates.content !== undefined && !isNonEmptyString(updates.content)) {
      return res.status(400).json({
        success: false,
        message: 'Content must be a non-empty string.',
      });
    }

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
    if (!isValidNoteId(req, res)) return;
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

export {
  createNote,
  listMyNotes,
  getMyNote,
  updateMyNote,
  deleteMyNote,
  listAllNotes,
};