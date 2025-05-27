const { dbPromise } = require('./db'); // Asegúrate que venga desde db.js

exports.getAutores = async () => {
  const [rows] = await dbPromise.query('SELECT * FROM Autor');
  return rows;
};

exports.createAutor = async (autor) => {
  const [result] = await dbPromise.query('INSERT INTO Autor (Autor) VALUES (?)', [autor]);
  return result;
};

exports.deleteAutor = async (autor) => {
  const [result] = await dbPromise.query('DELETE FROM Autor WHERE Autor = ?', [autor]);
  return result;
};

