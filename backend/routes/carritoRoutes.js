const express = require('express');
const router = express.Router();
const CarritoModel = require('../models/carritoModel');
const db = require('../models/db');
const authenticate = require('../middlewares/authMiddleware');

// Agregar libro al carrito
router.post('/agregar', authenticate, async (req, res) => {
    const idUsuario = req.user.id;  // Obtenido del token
    const { idLibro } = req.body;

    if (!idLibro) {
        return res.status(400).json({ 
            success: false, 
            error: 'Falta el idLibro en la solicitud'
        });
    }

    try {
        const [libro] = await db.query(
            'SELECT idLibro, titulo FROM libros WHERE idLibro = ?', 
            [idLibro]
        );
        
        if (libro.length === 0) {
            return res.status(404).json({ success: false, error: 'Libro no encontrado' });
        }

        await CarritoModel.agregarLibro(idUsuario, idLibro);

        const [result] = await db.query(
            'SELECT SUM(cantidad) AS total FROM carrito WHERE idUsuario = ?',
            [idUsuario]
        );

        res.json({ 
            success: true, 
            message: 'Libro agregado al carrito',
            book: libro[0].titulo,
            count: result[0].total || 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error agregando al carrito:', error);
        res.status(500).json({ success: false, error: 'Error en el servidor' });
    }
});

// Contar items en carrito
router.get('/count', authenticate, async (req, res) => {
    const idUsuario = req.user.id;
    
    try {
        const [result] = await db.query(
            'SELECT SUM(cantidad) AS total FROM carrito WHERE idUsuario = ?',
            [idUsuario]
        );

        res.json({ success: true, count: result[0].total || 0, userId: idUsuario });
    } catch (error) {
        console.error('Error contando carrito:', error);
        res.status(500).json({ success: false, error: 'Error al contar items' });
    }
});

module.exports = router;
