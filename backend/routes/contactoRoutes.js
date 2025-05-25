// 📁 routes/contactoRoutes.js
const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

router.get('/', contactoController.getContacto);
router.put('/', contactoController.updateContacto);

module.exports = router;
