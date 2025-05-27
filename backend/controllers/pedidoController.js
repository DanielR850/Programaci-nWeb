const { dbPromise: db } = require('../models/db');

exports.obtenerPedidosUsuario = async (req, res) => {
  const idUsuario = req.user.id;

  try {
    const [libros] = await db.query(`
      SELECT 
        l.idLibro,
        l.Título,
        l.Autor,
        l.Precio,
        l.RutaDeLaImagen,
        l.RutaDelLibroDescargable
      FROM Pedido_Libro pl
      JOIN Libros l ON pl.idLibro = l.idLibro
      JOIN Pedido p ON pl.idPedido = p.idPedido
      WHERE p.idUsuario = ?
    `, [idUsuario]);

    res.json(libros);
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener compras del usuario' });
  }
};
