const jwt = require('jsonwebtoken');
const db = require('../models/db'); // o el método que uses para consultar tu BD
const bcrypt = require('bcrypt');  // si usas hash para contraseñas

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Busca usuario en BD por email
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    // Validar contraseña (si usas hash)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token JWT con el id del usuario
    const token = jwt.sign(
      { id: user.idUsuario },  // o el campo que uses para el id usuario
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Responder con token
    res.json({ token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { login };
