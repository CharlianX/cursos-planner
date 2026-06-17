const express = require('express');
const router = express.Router();
const Planeacion = require('../models/Planeacion');

// Get all planeaciones for a user
router.get('/:usuario', async (req, res) => {
  try {
    const planeaciones = await Planeacion.find({ usuario: req.params.usuario });
    res.json(planeaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new planeacion
router.post('/', async (req, res) => {
  try {
    const planeacion = new Planeacion(req.body);
    await planeacion.save();
    res.status(201).json(planeacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update planeacion
router.put('/:id', async (req, res) => {
  try {
    const planeacion = await Planeacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(planeacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete planeacion
router.delete('/:id', async (req, res) => {
  try {
    await Planeacion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Planeacion eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
