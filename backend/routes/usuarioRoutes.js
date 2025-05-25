const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Endpoint de login
router.post('/login', usuarioController.loginUsuario);

module.exports = router;
