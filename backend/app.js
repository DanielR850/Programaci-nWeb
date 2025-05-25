const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 🔐 Cargar variables de entorno
dotenv.config({ path: __dirname + '/../.env' });

const app = express();
const port = process.env.PORT || 3000;

// 🌐 Middlewares
app.use(cors());
app.use(express.json());

// 📁 Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

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

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/contacto', contactoRoutes);

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});
