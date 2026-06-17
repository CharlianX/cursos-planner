const mongoose = require('mongoose');

const PlaneacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  usuario: { type: String, required: true },
  materias: [[{ type: String }]] // Array of arrays of course codes
}, { timestamps: true });

module.exports = mongoose.model('Planeacion', PlaneacionSchema, 'planeaciones');
