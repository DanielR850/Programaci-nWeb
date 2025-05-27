const express = require('express');
const router = express.Router();
const { dbPromise: db } = require('../models/db');
const authenticate = require('../middlewares/authMiddleware');

// 📥 GET /api/pedido/usuario/:idUsuario — Ver compras
router.get('/usuario/:idUsuario', authenticate, async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  const tokenUserId = req.user.id;

  if (idUsuario !== tokenUserId) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const [compras] = await db.query(`
      SELECT 
        l.idLibro,
        l.Título,
        l.Autor,
        l.Precio,
        l.RutaDeLaImagen
      FROM Pedido p
      JOIN Pedido_Libro pl ON p.idPedido = pl.idPedido
      JOIN Libros l ON pl.idLibro = l.idLibro
      WHERE p.idUsuario = ?
      ORDER BY p.Fecha DESC
    `, [idUsuario]);

    res.json(compras);
  } catch (error) {
    console.error('❌ Error al obtener compras:', error);
    res.status(500).json({ error: 'Error al obtener compras' });
  }
});

module.exports = router;
