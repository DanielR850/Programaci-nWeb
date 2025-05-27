// Importar dependencias
const db = require('../config/db'); // Conexión a la base de datos

const Pedido = {
  // Crear un nuevo pedido
  crear: async (pedidoData) => {
    try {
      const { usuario_id, productos, total, direccion_envio } = pedidoData;
      const [result] = await db.query(
        'INSERT INTO pedidos (usuario_id, total, direccion_envio) VALUES (?, ?, ?)',
        [usuario_id, total, direccion_envio]
      );

      // Insertar productos del pedido en la tabla pedido_productos
      const pedidoId = result.insertId;
      for (const producto of productos) {
        await db.query(
          'INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)',
          [pedidoId, producto.id, producto.cantidad]
        );
      }

      return pedidoId;
    } catch (error) {
      throw new Error(`Error al crear pedido: ${error.message}`);
    }
  },

  // Obtener pedido por ID
  obtenerPorId: async (id) => {
    try {
      const [pedido] = await db.query(
        'SELECT * FROM pedidos WHERE id = ?',
        [id]
      );
      
      if (!pedido[0]) return null;

      // Obtener productos asociados al pedido
      const [productos] = await db.query(
        `SELECT 
          productos.id, 
          productos.nombre, 
          productos.precio,
          pedido_productos.cantidad 
         FROM pedido_productos 
         JOIN productos ON pedido_productos.producto_id = productos.id 
         WHERE pedido_id = ?`,
        [id]
      );

      return {
        ...pedido[0],
        productos
      };
    } catch (error) {
      throw new Error(`Error al obtener pedido: ${error.message}`);
    }
  },

  // Actualizar estado de un pedido
  actualizarEstado: async (id, nuevoEstado) => {
    try {
      await db.query(
        'UPDATE pedidos SET estado = ? WHERE id = ?',
        [nuevoEstado, id]
      );
      return true;
    } catch (error) {
      throw new Error(`Error al actualizar pedido: ${error.message}`);
    }
  },

  // Obtener todos los pedidos de un usuario
  obtenerPorUsuario: async (usuarioId) => {
    try {
      const [pedidos] = await db.query(
        'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha DESC',
        [usuarioId]
      );
      return pedidos;
    } catch (error) {
      throw new Error(`Error al obtener pedidos: ${error.message}`);
    }
  }
};

module.exports = Pedido;
