const Libro = require('../models/libroModel');

exports.getLibros = async (req, res) => {
  try {
    const libros = await Libro.getLibros();
    res.json(libros);
  } catch (err) {
    console.error(err);
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
