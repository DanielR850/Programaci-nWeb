const ReporteModel = require('../models/reportemodel');

exports.getReportes = async (req, res) => {
  try {
    const bestSellers = await ReporteModel.getTopVendidos();
    const leastSold = await ReporteModel.getMenosVendidos();
    res.json({ bestSellers, leastSold });
  } catch (err) {
    console.error('Error al obtener reportes:', err);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

