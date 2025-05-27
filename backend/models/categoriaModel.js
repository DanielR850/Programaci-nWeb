const { dbPromise } = require('./db'); // Usa la conexión con promesas

exports.getCategorias = async () => {
  const [rows] = await dbPromise.query('SELECT * FROM Categoria');
  return rows;
};

exports.createCategoria = async (data) => {
  const [result] = await dbPromise.query('INSERT INTO Categoria SET ?', [data]);
  return result;
};

exports.deleteCategoria = async (id) => {
  const [result] = await dbPromise.query('DELETE FROM Categoria WHERE idCategoria = ?', [id]);
  return result;
};
