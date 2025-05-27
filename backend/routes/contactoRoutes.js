const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

// Obtener el texto de contacto
router.get('/', contactoController.getContacto);

// Actualizar el texto de contacto (si decides hacerlo desde admin)
router.put('/', contactoController.updateContacto);

module.exports = router;
