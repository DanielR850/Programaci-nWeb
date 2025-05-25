const db = require('../models/db');

exports.obtenerUsuarios = (req, res) => {
  db.query('SELECT * FROM Usuario', (err, results) => {
    if (err) {
      console.error('Error al consultar usuarios:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
};
