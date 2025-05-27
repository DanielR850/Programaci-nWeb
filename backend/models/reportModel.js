const db = require('./db');

exports.getBestSellers = () => {
  const sql = `
    SELECT l.Título, l.Autor, COUNT(pl.idLibro) AS ventas, l.Precio
    FROM Pedido_Libro pl
    JOIN Libros l ON pl.idLibro = l.idLibro
    GROUP BY pl.idLibro
    ORDER BY ventas DESC
    LIMIT 5
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.getLeastSold = () => {
  const sql = `
    SELECT l.Título, l.Autor, COUNT(pl.idLibro) AS ventas, l.Precio
    FROM Pedido_Libro pl
    JOIN Libros l ON pl.idLibro = l.idLibro
    GROUP BY pl.idLibro
    ORDER BY ventas ASC
    LIMIT 5
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
