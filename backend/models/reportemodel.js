const db = require('./db');

// Libros más vendidos
exports.getTopVendidos = (limit = 5) => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT l.Título, l.Autor, COUNT(pl.idLibro) AS ventas
    FROM pedido_libro pl
    JOIN Libros l ON pl.idLibro = l.idLibro
    GROUP BY pl.idLibro
    ORDER BY ventas DESC
    LIMIT ?
    `;
    db.query(sql, [limit], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Libros menos vendidos
exports.getMenosVendidos = (limit = 5) => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT l.Título, l.Autor, COALESCE(COUNT(pl.idLibro), 0) AS ventas
    FROM Libros l
    LEFT JOIN pedido_libro pl ON l.idLibro = pl.idLibro
    GROUP BY l.idLibro
    ORDER BY ventas ASC
    LIMIT ?
    `;
    db.query(sql, [limit], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
