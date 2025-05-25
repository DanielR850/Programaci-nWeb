const db = require('./db');

exports.getAutores = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Autor', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.createAutor = (autor) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Autor (Autor) VALUES (?)';
    db.query(sql, [autor], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.deleteAutor = (autor) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Autor WHERE Autor = ?';
    db.query(sql, [autor], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
