// models/carritoModel.js
const db = require('./db');

exports.agregarLibro = (idUsuario, idLibro) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Carrito (idUsuario, idLibro) VALUES (?, ?)`;
    db.query(sql, [idUsuario, idLibro], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
