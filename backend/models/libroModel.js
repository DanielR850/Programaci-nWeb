const db = require('./db');

exports.getLibros = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Libros', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.createLibro = (data) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Libros SET ?';
    db.query(sql, data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.updateLibro = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Libros SET ? WHERE idLibro = ?';
    db.query(sql, [data, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.deleteLibro = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Libros WHERE idLibro = ?';
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};


exports.getLibroById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Libros WHERE idLibro = ?', [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};
