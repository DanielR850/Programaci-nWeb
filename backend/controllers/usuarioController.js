const { dbCallback } = require('../models/db');
const jwt = require('jsonwebtoken');

exports.loginUsuario = (req, res) => {
  const { email, username, password, role } = req.body;
  const roleNombre = role === 'admin' ? 'Administrador' : 'Cliente';

  const sql = `
    SELECT u.*, t.NombreTipo 
    FROM Usuario u
    JOIN TipoUsuario t ON u.idTipoUsuario = t.idTipoUsuario
    WHERE u.Email = ? AND u.Username = ? AND u.Contraseña = ? AND t.NombreTipo = ?
  `;

  dbCallback.query(sql, [email, username, password, roleNombre], (err, results) => {
    if (err) {
      console.error('❌ Error en login:', err);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }

    if (results.length > 0) {
      const usuario = results[0];

      const token = jwt.sign(
        { id: usuario.idUsuario, role: usuario.NombreTipo },
        process.env.JWT_SECRET || 'libros123',
        { expiresIn: '2h' }
      );

      res.json({
        success: true,
        idUsuario: usuario.idUsuario,
        username: usuario.Username,
        role: usuario.NombreTipo.toLowerCase(),
        token: token
      });

    } else {
      res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
};

exports.obtenerUsuarios = (req, res) => {
  const sql = `
    SELECT u.idUsuario, u.Username, u.Email
    FROM Usuario u
    JOIN TipoUsuario t ON u.idTipoUsuario = t.idTipoUsuario
    WHERE t.NombreTipo = 'cliente'
  `;
  dbCallback.query(sql, (err, results) => {
    if (err) {
      console.error('Error al consultar usuarios cliente:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
};

exports.crearUsuario = async (req, res) => {
  try {
    const { Username, Email, Contraseña, idTipoUsuario } = req.body;

    if (!Username || !Email || !Contraseña || !idTipoUsuario) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const sql = `INSERT INTO Usuario (Username, Email, Contraseña, idTipoUsuario) VALUES (?, ?, ?, ?)`;

    dbCallback.query(sql, [Username, Email, Contraseña, idTipoUsuario], (err, result) => {
      if (err) {
        console.error('Error al insertar usuario:', err);

        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            success: false,
            message: '❌ El nombre de usuario o correo ya está en uso.'
          });
        }

        return res.status(500).json({ success: false, message: '❌ Error en el servidor' });
      }

      res.status(201).json({ success: true, message: '✅ Usuario creado con éxito' });
    });
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ success: false, message: '❌ Error inesperado en el servidor' });
  }
};

exports.obtenerComprasPorUsuario = (req, res) => {
  const { idUsuario } = req.params;
  const sql = `
    SELECT l.Título, l.Autor, l.Precio, p.idPedido
    FROM Pedido p
    JOIN Pedido_Libro pl ON p.idPedido = pl.idPedido
    JOIN Libros l ON l.idLibro = pl.idLibro
    WHERE p.idUsuario = ?
  `;
  dbCallback.query(sql, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error al consultar compras del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener compras' });
    }
    res.json(results);
  });
};
