// 📁 models/reportModel.js
const { dbPromise } = require('./db');

exports.getBestSellers = async () => {
  const sql = `
    SELECT 
      l.Título,
      l.Autor,
      COALESCE(COUNT(pl.idLibro), 0) AS Ventas,
      l.Precio
    FROM Libros l
    LEFT JOIN Pedido_Libro pl ON l.idLibro = pl.idLibro
    GROUP BY l.idLibro
    ORDER BY Ventas DESC
    LIMIT 5
  `;
  const [results] = await dbPromise.query(sql);
  return results;
};

exports.getLeastSold = async () => {
  const sql = `
    SELECT 
      l.Título,
      l.Autor,
      COALESCE(COUNT(pl.idLibro), 0) AS Ventas,
      l.Precio
    FROM Libros l
    LEFT JOIN Pedido_Libro pl ON l.idLibro = pl.idLibro
    GROUP BY l.idLibro
    ORDER BY Ventas ASC
    LIMIT 5
  `;
  const [results] = await dbPromise.query(sql);
  return results;
};
