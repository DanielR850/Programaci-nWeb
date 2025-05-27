const Libro = require('../models/libroModel');
const path = require('path');
const { dbPromise } = require('../models/db'); // Asegúrate de importar la conexión correcta si no está

exports.getLibros = async (req, res) => {
  const { categoria, q } = req.query;

  let sql = `
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
    WHERE 1=1
  `;

  const params = [];

  if (categoria) {
    sql += ' AND l.idCategoria = ?';
    params.push(categoria);
  }

  if (q) {
    sql += ' AND (l.Título LIKE ? OR l.Autor LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += ' GROUP BY l.idLibro';

  try {
    const [libros] = await dbPromise.query(sql, params);
    res.json(libros);
  } catch (err) {
    console.error('Error al obtener libros:', err);
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

exports.createLibro = async (req, res) => {
  try {
    const result = await Libro.createLibro(req.body);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear libro' });
  }
};

exports.updateLibro = async (req, res) => {
  try {
    await Libro.updateLibro(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar libro' });
  }
};

exports.deleteLibro = async (req, res) => {
  try {
    await Libro.deleteLibro(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar libro' });
  }
};


exports.getLibroById = async (req, res) => {
  try {
    const libro = await Libro.getLibroById(req.params.id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).json({ error: 'Libro no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libro' });
  }
};
exports.subirImagen = (req, res) => {
  if (!req.files || !req.files.imagen) {
    return res.status(400).json({ error: 'No se recibió ningún archivo' });
  }

  const archivo = req.files.imagen;
  const nombre = Date.now() + '-' + archivo.name;
  const rutaDestino = path.join(__dirname, '../../frontend/assets/image/', nombre);

  archivo.mv(rutaDestino, (err) => {
    if (err) {
      console.error('❌ Error al mover imagen:', err);
      return res.status(500).json({ error: 'Error al guardar imagen' });
    }

    // Guardar solo la ruta relativa para servirla desde frontend
    res.json({ ruta: `/assets/image/${nombre}` });
  });
};


exports.subirPDF = (req, res) => {
  if (!req.files || !req.files.pdf) {
    return res.status(400).json({ error: 'No se recibió ningún PDF' });
  }

  const archivo = req.files.pdf;
  const nombre = Date.now() + '-' + archivo.name;
  const rutaDestino = path.join(__dirname, '../../frontend/assets/descargables/', nombre);

  archivo.mv(rutaDestino, (err) => {
    if (err) {
      console.error('❌ Error al mover PDF:', err);
      return res.status(500).json({ error: 'Error al guardar PDF' });
    }

    res.json({ ruta: `/assets/descargables/${nombre}` });
  });
};

exports.getLibrosPorCategoria = (categoria) => {
  return new Promise((resolve, reject) => {
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
      WHERE c.Category = ?
      GROUP BY l.idLibro
    `;

    db.query(sql, [categoria], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
