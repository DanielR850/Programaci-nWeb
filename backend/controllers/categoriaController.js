const Categoria = require('../models/categoriaModel');

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.getCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const result = await Categoria.createCategoria(req.body);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    await Categoria.deleteCategoria(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
