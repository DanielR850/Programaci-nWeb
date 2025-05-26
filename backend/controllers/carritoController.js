exports.agregarAlCarrito = async (req, res) => {
  const { idUsuario, idLibro } = req.body;

  // Validación explícita (agrega esto)
  if (!idUsuario || !idLibro) {
    return res.status(400).json({ 
      success: false, 
      error: 'Datos incompletos' 
    });
  }

  try {
    // Verificación de existencia (mejorada)
    const [libro] = await db.query(
      'SELECT idLibro FROM libros WHERE idLibro = ?', 
      [idLibro]
    );
    
    if (libro.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: `El libro con ID ${idLibro} no existe` 
      });
    }

    // Insertar con manejo de duplicados
    await db.query(`
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
    
    // Manejo específico de errores de FK
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