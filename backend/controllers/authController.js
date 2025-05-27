const jwt = require('jsonwebtoken');
const { dbPromise } = require('../models/db'); // 🔄 Usa dbPromise para await
const bcrypt = require('bcrypt');  // si usas hash para contraseñas

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Busca usuario en BD por email
    const [rows] = await dbPromise.query('SELECT * FROM usuarios WHERE email = ?', [email]);

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
      { id: user.idUsuario },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );

    // Responder con token
    res.json({ 
      success: true,
      token,
      idUsuario: user.idUsuario,
      username: user.username, // si lo necesitas
      role: user.rol // si usas roles
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { login };
