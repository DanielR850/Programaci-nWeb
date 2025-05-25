// 📁 models/contactoModel.js
const db = require('./db');

exports.getContacto = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Contacto LIMIT 1', (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

exports.updateContacto = (descripcion) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE Contacto SET Descripcion = ? WHERE idContacto = 1', [descripcion], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
