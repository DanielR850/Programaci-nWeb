const db = require('../models/db');

exports.obtenerUsuarios = (req, res) => {
  const sql = 'SELECT idUsuario, Username, Email FROM Usuario';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar usuarios:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
};


exports.obtenerComprasPorUsuario = (req, res) => {
  const { idUsuario } = req.params;
  const sql = `
    SELECT l.Título, l.Autor, l.Precio, p.idPedido
    FROM Pedido p
    JOIN Pedido_Libro pl ON p.idPedido = pl.idPedido
    JOIN Libros l ON l.idLibro = pl.idLibro
    WHERE p.idUsuario = ?
  `;
  db.query(sql, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error al consultar compras del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener compras' });
    }
    res.json(results);
  });
};
