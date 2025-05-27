const express = require('express');
const router = express.Router();
const { dbPromise: db } = require('../models/db');
const authenticate = require('../middlewares/authMiddleware');

// ➕ POST /api/carrito — Agregar libro al carrito
router.post('/', authenticate, async (req, res) => {
  const idUsuario = req.user.id;
  const { idLibro } = req.body;

  if (!idLibro) {
    return res.status(400).json({ success: false, error: 'Falta idLibro' });
  }

  try {
    // Verifica que el libro exista
    const [libro] = await db.query('SELECT idLibro FROM libros WHERE idLibro = ?', [idLibro]);

    if (libro.length === 0) {
      return res.status(404).json({ success: false, error: 'Libro no encontrado' });
    }

    // Evita duplicados con INSERT IGNORE
    await db.query(`
      INSERT IGNORE INTO carrito (idUsuario, idLibro)
      VALUES (?, ?)
    `, [idUsuario, idLibro]);

    res.json({ success: true, message: 'Libro agregado al carrito' });

  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});


// 📦 GET /api/carrito/usuario/:idUsuario — Obtener libros del carrito
router.get('/usuario/:idUsuario', authenticate, async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);
  const tokenUserId = req.user.id;

  if (idUsuario !== tokenUserId) {
    return res.status(403).json({ success: false, error: 'No autorizado' });
  }

  try {
    const [items] = await db.query(`
      SELECT c.idLibro, l.Título, l.Autor, l.Precio, l.RutaDeLaImagen
      FROM carrito c
      JOIN libros l ON c.idLibro = l.idLibro
      WHERE c.idUsuario = ?
    `, [idUsuario]);

    res.json(items);

  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// 🗑 DELETE /api/carrito/:idUsuario/:idLibro — Eliminar libro del carrito
router.delete('/:idUsuario/:idLibro', authenticate, async (req, res) => {
  const { idUsuario, idLibro } = req.params;
  const tokenUserId = req.user.id;

  if (parseInt(idUsuario) !== tokenUserId) {
    return res.status(403).json({ success: false, error: 'No autorizado' });
  }

  try {
    await db.query('DELETE FROM carrito WHERE idUsuario = ? AND idLibro = ?', [idUsuario, idLibro]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error eliminando del carrito:', err);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});
// ✅ POST /api/carrito/confirmar — Confirmar compra y mover a pedidos
router.post('/confirmar', authenticate, async (req, res) => {
  const idUsuario = req.user.id;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [pedidoRes] = await conn.query(
      'INSERT INTO Pedido (idUsuario, Fecha) VALUES (?, NOW())',
      [idUsuario]
    );
    const idPedido = pedidoRes.insertId;

    const [libros] = await conn.query(
      'SELECT idLibro FROM carrito WHERE idUsuario = ?',
      [idUsuario]
    );

    if (libros.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, error: 'El carrito está vacío' });
    }

    for (const { idLibro } of libros) {
      await conn.query(
        'INSERT INTO Pedido_Libro (idPedido, idLibro) VALUES (?, ?)',
        [idPedido, idLibro]
      );
    }

    await conn.query('DELETE FROM carrito WHERE idUsuario = ?', [idUsuario]);

    await conn.commit();
    res.json({ success: true, message: 'Compra confirmada' });
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error al confirmar compra:', err);
    res.status(500).json({ success: false, error: 'Error al confirmar compra' });
  } finally {
    conn.release();
  }
});


module.exports = router;
