const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Ver compras de un usuario
router.get('/:idUsuario/compras', usuarioController.obtenerComprasPorUsuario);

// Endpoint de login
router.post('/login', usuarioController.loginUsuario);

// Crear usuario
router.post('/', usuarioController.crearUsuario);

module.exports = router;
