const Categoria = require('../models/categoriaModel');

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.getCategorias();
    res.json(categorias);
  } catch (err) {
    console.error('❌ Error al obtener categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { Categoria: nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre de categoría requerido' });
    }

    const result = await Categoria.createCategoria(nombre);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('❌ Error al crear categoría:', err);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.deleteCategoria(id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error al eliminar categoría:', err);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};
