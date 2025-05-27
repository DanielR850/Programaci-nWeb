// backend/models/db.js
const mysql = require('mysql2'); // 🔁 Para funciones con callbacks (login, usuario, etc.)
const mysqlPromise = require('mysql2/promise'); // ✅ Para funciones modernas (carrito, async/await)
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../../.env' });

// 🌐 Información útil para depurar
console.log('🧪 Probando conexión con:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

// 🔁 Conexión callback
const dbCallback = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

dbCallback.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar (callback):', err.message);
  } else {
    console.log('✅ Conectado (callback)');
  }
});

// ✅ Conexión Promesas
const dbPromise = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  dbCallback,
  dbPromise
};
