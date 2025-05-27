const Autor = require('../models/autorModel');

exports.getAutores = async (req, res) => {
  try {
    const autores = await Autor.getAutores();
    res.json(autores);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener autores' });
  }
};

exports.createAutor = async (req, res) => {
  try {
    const { Autor: nombre } = req.body;
    const result = await Autor.createAutor(nombre);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar autor' });
  }
};

exports.deleteAutor = async (req, res) => {
  try {
    const { nombre } = req.params;
    await Autor.deleteAutor(nombre);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar autor' });
  }
};
