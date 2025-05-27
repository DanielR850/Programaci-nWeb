
const express = require('express');
const router = express.Router();
const { dbPromise: db } = require('../models/db');
const authenticate = require('../middlewares/authMiddleware');

// GET /api/pedido/usuario/:idUsuario
router.get('/usuario/:idUsuario', authenticate, async (req, res) => {
  const { idUsuario } = req.params;
  const tokenUserId = req.user.id;

  if (parseInt(idUsuario) !== tokenUserId) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const [libros] = await db.query(`
      SELECT 
        l.Título, 
        l.Autor, 
        l.Precio, 
        l.RutaDeLaImagen,
        l.RutaDelLibroDescargable
      FROM Pedido p
      JOIN Pedido_Libro pl ON p.idPedido = pl.idPedido
      JOIN Libros l ON pl.idLibro = l.idLibro
      WHERE p.idUsuario = ?
    `, [idUsuario]);

    res.json(libros);
  } catch (err) {
    console.error('❌ Error al obtener compras:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
module.exports = router;
