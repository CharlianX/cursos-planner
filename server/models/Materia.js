const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  no_creditos: { type: Number, required: true },
  codigo: { type: String, required: true, unique: true },
  prerrequisitos: [[{ type: String }]],
  carrera: { type: String, required: true },
  usuario: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Materia', MateriaSchema, 'materias');
