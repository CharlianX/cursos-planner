const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Login or Register
router.post('/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contrasena son requeridos' });
  }

  try {
    let user = await Usuario.findOne({ usuario });
    
    if (user) {
      // User exists, verify password
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      return res.json({ message: 'Login exitoso', usuario: user.usuario });
    } else {
      // Register new user (for simplicity in this app)
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      user = new Usuario({ usuario, contrasena: hashedPassword });
      await user.save();
      return res.status(201).json({ message: 'Usuario registrado y logueado', usuario: user.usuario });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
