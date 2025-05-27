const { dbPromise } = require('../models/db');

// ✅ Obtener contacto
exports.getContacto = async (req, res) => {
  try {
    const [rows] = await dbPromise.query('SELECT Descripcion FROM Contacto WHERE idContacto = 1 LIMIT 1');

    if (rows.length === 0) {
      return res.status(200).json({ success: true, descripcion: null });
    }

    res.status(200).json({
      success: true,
      descripcion: rows[0].Descripcion
    });

  } catch (err) {
    console.error('Error al obtener contacto:', err);
    res.status(500).json({ success: false, error: 'Error al obtener contacto' });
  }
};

// ✅ Actualizar contacto
exports.updateContacto = async (req, res) => {
  const { Descripcion, idUsuario } = req.body;

  if (!Descripcion || !idUsuario) {
    return res.status(400).json({ success: false, error: 'Faltan datos necesarios' });
  }

  try {
    const [result] = await dbPromise.query(
      'UPDATE Contacto SET Descripcion = ?, idUsuario = ? WHERE idContacto = 1',
      [Descripcion, idUsuario]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error al actualizar contacto:', err);
    res.status(500).json({ success: false, error: 'Error al actualizar contacto' });
  }
};
