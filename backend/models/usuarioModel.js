const db = require('./db');

const crearUsuarioDB = (username, email, password, tipoUsuarioId, callback) => {
  const query = `
    INSERT INTO Usuario (Username, Email, Contraseña, idTipoUsuario)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [username, email, password, tipoUsuarioId], callback);
};

module.exports = { crearUsuarioDB };
