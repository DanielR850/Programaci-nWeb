let carrito = [];

exports.agregarProducto = (req, res) => {
  const { productoId, cantidad } = req.body;
  carrito.push({ productoId, cantidad });
  res.status(201).json({ mensaje: "Producto agregado al carrito", carrito });
};

exports.obtenerCarrito = (req, res) => {
  res.json(carrito);
};
