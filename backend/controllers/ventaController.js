// 📁 controllers/ventaController.js
const Venta = require('../models/ventamodel');

exports.getVentas = async (req, res) => {
  try {
    const ventas = await Venta.getVentas();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
};