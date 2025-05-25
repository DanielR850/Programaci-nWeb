// 📁 models/ventaModel.js
const db = require('./db');

exports.getVentas = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT l.Título, l.Autor, COUNT(pl.idLibro) AS unidades, l.Precio
      FROM Pedido_Libro pl
      JOIN Libros l ON pl.idLibro = l.idLibro
      GROUP BY pl.idLibro
      ORDER BY unidades DESC
    `;
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};