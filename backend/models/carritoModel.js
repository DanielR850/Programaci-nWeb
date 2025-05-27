const { dbPromise } = require('./db');

exports.getCarritoPorUsuario = async (idUsuario) => {
  const sql = `
    SELECT c.idLibro, l.Título, l.Autor, l.Precio, l.RutaDeLaImagen
    FROM carrito c
    JOIN libros l ON c.idLibro = l.idLibro
    WHERE c.idUsuario = ?
  `;
  const [rows] = await dbPromise.query(sql, [idUsuario]);
  return rows;
};

exports.eliminarDelCarrito = async (idUsuario, idLibro) => {
  const sql = 'DELETE FROM carrito WHERE idUsuario = ? AND idLibro = ?';
  const [result] = await dbPromise.query(sql, [idUsuario, idLibro]);
  return result;
};
