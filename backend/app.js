const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');

// 🔐 Cargar variables de entorno
dotenv.config({ path: __dirname + '/../.env' });

const app = express();
const port = process.env.PORT || 3000;

// 🌐 Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// 📁 Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ NUEVO: Servir imágenes y PDFs directamente desde assets

app.use('/assets/image', express.static(path.join(__dirname, '../frontend/assets/image')));
app.use('/assets/descargables', express.static(path.join(__dirname, '../frontend/assets/descargables')));
// 🏠 Ruta raíz -> home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/home.html'));
});

// 📦 Rutas API
const usuarioRoutes = require('./routes/usuarioRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const libroRoutes = require('./routes/libroRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const autorRoutes = require('./routes/autorRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/pedido', pedidoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/autores', autorRoutes);
app.use('/api/carrito', carritoRoutes);


// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});
