const express = require('express');
const router = express.Router();
const Materia = require('../models/Materia');

// Get all materias
router.get('/', async (req, res) => {
  try {
    const materias = await Materia.find();
    res.json(materias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create single materia
router.post('/', async (req, res) => {
  try {
    const materia = new Materia(req.body);
    await materia.save();
    res.status(201).json(materia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create multiple materias
router.post('/bulk', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Expected an array' });
    const inserted = await Materia.insertMany(req.body);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update materia
router.put('/:id', async (req, res) => {
  try {
    const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(materia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete materia
router.delete('/:id', async (req, res) => {
  try {
    await Materia.findByIdAndDelete(req.params.id);
    res.json({ message: 'Materia eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
