const mysql = require('mysql2');
const dotenv = require('dotenv');

// ✅ Ruta corregida al archivo .env (2 niveles arriba)
dotenv.config({ path: __dirname + '/../../.env' });

console.log('🧪 Probando conexión con:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err.message);
    return;
  }
  console.log('✅ Conexión exitosa a la base de datos');
  
  db.query('SELECT DATABASE() AS base', (err, result) => {
  if (err) throw err;
  console.log('📊 Base de datos activa:', result[0].base);
});

<<<<<<< HEAD
db.on('error', (err) => {
  console.error('❌ Error de conexión:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconectando a la base de datos...');
    db.connect(); // Reconexión automática
  }
});

=======
});



>>>>>>> 9e96a18dd8149b7c144fd60684cbb653ea187dd4
module.exports = db;
