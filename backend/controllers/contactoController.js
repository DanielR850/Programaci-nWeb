// 📁 controllers/contactoController.js
const Contacto = require('../models/contactoModel');

exports.getContacto = async (req, res) => {
  try {
    const data = await Contacto.getContacto();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener contacto' });
  }
};

exports.updateContacto = async (req, res) => {
  try {
    await Contacto.updateContacto(req.body.descripcion);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
};
