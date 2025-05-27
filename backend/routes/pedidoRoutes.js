const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/pedidoController");

// Agregar producto al carrito
router.post("/agregar", carritoController.agregarProducto);

// Obtener productos del carrito
router.get("/", carritoController.obtenerCarrito);

module.exports = router;
