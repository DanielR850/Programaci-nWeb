// 📁 models/libroModel.js
const { dbPromise } = require('./db'); // asegúrate de exportarlo así desde db.js

exports.getLibros = async () => {
  const sql = `
    SELECT 
      l.idLibro,
      l.Título,
      l.Autor,
      l.Precio,
      l.Descripción,
      l.RutaDeLaImagen,
      l.RutaDelLibroDescargable,
      l.idCategoria,
      c.Category AS Categoria,
      COALESCE(COUNT(pl.idLibro), 0) AS Ventas
    FROM Libros l
    LEFT JOIN Pedido_Libro pl ON l.idLibro = pl.idLibro
    LEFT JOIN Categoria c ON l.idCategoria = c.idCategoria
    GROUP BY l.idLibro
  `;
  const [rows] = await dbPromise.query(sql);
  return rows;
};

exports.createLibro = async (data) => {
  const [result] = await dbPromise.query('INSERT INTO Libros SET ?', [data]);
  return result;
};

exports.updateLibro = async (id, data) => {
  const [result] = await dbPromise.query('UPDATE Libros SET ? WHERE idLibro = ?', [data, id]);
  return result;
};

exports.deleteLibro = async (id) => {
  const [result] = await dbPromise.query('DELETE FROM Libros WHERE idLibro = ?', [id]);
  return result;
};

exports.getLibroById = async (id) => {
  const [rows] = await dbPromise.query('SELECT * FROM Libros WHERE idLibro = ?', [id]);
  return rows[0]; // puede ser undefined si no existe
};
