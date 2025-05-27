const Reporte = require('../models/reportModel');

exports.getReportes = async (req, res) => {
  try {
    const bestSellers = await Reporte.getBestSellers();
    const leastSold = await Reporte.getLeastSold();
    res.json({ bestSellers, leastSold });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar reportes' });
  }
};
