const express = require('express');
const router = express.Router();
const testController = require('../controllers/testcontroller');

router.get('/usuarios', testController.obtenerUsuarios);

module.exports = router;
