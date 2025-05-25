// 📁 controllers/libroController.js
const Libro = require('../models/libroModel');

exports.getLibros = async (req, res) => {
  try {
    const libros = await Libro.getLibros();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

exports.createLibro = async (req, res) => {
  try {
    const result = await Libro.createLibro(req.body);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
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