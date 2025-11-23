import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes?tag=&search=&page=&perPage=
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search = '', page = 1, perPage = 10 } = req.query;

    const filter = {};
    if (tag) filter.tag = tag;
    // якщо search не порожній — текстовий пошук
    if (typeof search === 'string' && search.trim() !== '') {
      filter.$text = { $search: search.trim() };
    }

    const p = Number(page);
    const limit = Number(perPage);
    const skip = (p - 1) * limit;

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Note.countDocuments(filter),
    ]);

    return res.status(200).json({
      page: p,
      perPage: limit,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit) || 1,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// решта контролерів у тебе вже є і валідні
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndUpdate(noteId, req.body, { new: true });
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};
