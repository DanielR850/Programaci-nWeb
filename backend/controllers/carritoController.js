const { dbPromise } = require('../models/db'); // Asegúrate de importar correctamente
const Carrito = require('../models/carritoModel');

exports.agregarAlCarrito = async (req, res) => {
  const { idUsuario, idLibro } = req.body;

  if (!idUsuario || !idLibro) {
    return res.status(400).json({ 
      success: false, 
      error: 'Datos incompletos' 
    });
  }

  try {
    const [libro] = await dbPromise.query(
      'SELECT idLibro FROM libros WHERE idLibro = ?', 
      [idLibro]
    );

    if (libro.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: `El libro con ID ${idLibro} no existe` 
      });
    }

    await dbPromise.query(`
      INSERT INTO carrito (idUsuario, idLibro, cantidad) 
      VALUES (?, ?, 1)
      ON DUPLICATE KEY UPDATE cantidad = cantidad + 1
    `, [idUsuario, idLibro]);

    res.json({ 
      success: true, 
      message: 'Libro agregado al carrito'
    });

  } catch (error) {
    console.error('Error en agregarAlCarrito:', error);

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        error: `El usuario con ID ${idUsuario} no existe`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error en el servidor',
      detalle: error.message
    });
  }
};

exports.obtenerPorUsuario = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const [result] = await dbPromise.query(`
      SELECT c.idLibro, l.Título, l.Autor, l.Precio, l.RutaDeLaImagen, c.cantidad
      FROM carrito c
      JOIN libros l ON c.idLibro = l.idLibro
      WHERE c.idUsuario = ?
    `, [idUsuario]);

    res.json(result);
  } catch (error) {
    console.error('Error al obtener el carrito del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos del carrito'
    });
  }
};

exports.getCarritoUsuario = async (req, res) => {
  const idUsuario = parseInt(req.params.idUsuario);

  if (req.user.id !== idUsuario) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const items = await Carrito.getCarritoPorUsuario(idUsuario);
    res.json(items);
  } catch (err) {
    console.error('❌ Error al obtener el carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

exports.eliminarItemCarrito = async (req, res) => {
  const idUsuario = req.user.id;
  const idLibro = parseInt(req.params.idLibro);

  try {
    await Carrito.eliminarDelCarrito(idUsuario, idLibro);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error al eliminar del carrito:', err);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};