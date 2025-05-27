const db = require('./db');

exports.getCategorias = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Categoria', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.createCategoria = (data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO Categoria SET ?', data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.deleteCategoria = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Categoria WHERE idCategoria = ?', [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
