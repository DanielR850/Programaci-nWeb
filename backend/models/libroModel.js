// 📁 models/libroModel.js
const db = require('./db');

exports.getLibros = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Libros';
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.createLibro = (data) => {
  const sql = 'INSERT INTO Libros SET ?';
  return new Promise((resolve, reject) => {
    db.query(sql, data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.updateLibro = (id, data) => {
  const sql = 'UPDATE Libros SET ? WHERE idLibro = ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [data, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.deleteLibro = (id) => {
  const sql = 'DELETE FROM Libros WHERE idLibro = ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};