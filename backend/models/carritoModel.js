const db = require('./db'); 

class CarritoModel {
    /**
     * Agrega un libro al carrito de compras
     * @param {number} idUsuario - ID del usuario
     * @param {number} idLibro - ID del libro
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async agregarLibro(idUsuario, idLibro) {
        try {
            const [result] = await db.query(
                `INSERT INTO carrito (idUsuario, idLibro, cantidad) 
                 VALUES (?, ?, 1)
                 ON DUPLICATE KEY UPDATE cantidad = cantidad + 1`,
                [idUsuario, idLibro]
            );
            
            return {
                success: true,
                affectedRows: result.affectedRows,
                insertId: result.insertId
            };
        } catch (error) {
            console.error('Error en CarritoModel.agregarLibro:', error);
            throw error;
        }
    }

    /**
     * Obtiene el conteo de items en el carrito
     * @param {number} idUsuario - ID del usuario
     * @returns {Promise<number>} - Cantidad total de items
     */
    static async contarItems(idUsuario) {
        try {
            const [result] = await db.query(
                'SELECT SUM(cantidad) AS total FROM carrito WHERE idUsuario = ?',
                [idUsuario]
            );
            return result[0].total || 0;
        } catch (error) {
            console.error('Error en CarritoModel.contarItems:', error);
            throw error;
        }
    }

    /**
     * Verifica la conexión a la base de datos
     * @returns {Promise<boolean>} - True si la conexión es exitosa
     */
    static async verificarConexion() {
        try {
            const [rows] = await db.query('SELECT 1');
            return rows.length > 0;
        } catch (error) {
            console.error('Error verificando conexión DB:', error);
            return false;
        }
    }
}

module.exports = CarritoModel;