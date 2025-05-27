const db = require('../models/db');


exports.loginUsuario = (req, res) => {
  const { email, username, password, role } = req.body;

  // Convertir 'admin' o 'client' en el nombre exacto de la tabla tipousuario
  const roleNombre = role === 'admin' ? 'Administrador' : 'Cliente';

  const sql = `
    SELECT u.*, t.NombreTipo FROM usuario u
    JOIN tipousuario t ON u.idTipoUsuario = t.idTipoUsuario
    WHERE u.Email = ? AND u.Username = ? AND u.Contraseña = ? AND t.NombreTipo = ?
  `;

  db.query(sql, [email, username, password, roleNombre], (err, results) => {
    if (err) {
      console.error('❌ Error en login:', err);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }

    if (results.length > 0) {
      res.json({ success: true, username: results[0].Username });
    } else {
      res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
};


exports.obtenerUsuarios = (req, res) => {
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
};

exports.crearUsuario = async (req, res) => {
  try {
    const { Username, Email, Contraseña, idTipoUsuario } = req.body;

    const sql = `INSERT INTO Usuario (Username, Email, Contraseña, idTipoUsuario) VALUES (?, ?, ?, ?)`;
    db.query(sql, [Username, Email, Contraseña, idTipoUsuario], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
