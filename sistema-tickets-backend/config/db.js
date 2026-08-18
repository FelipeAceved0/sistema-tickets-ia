const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones a MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión inicial
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos MySQL (XAMPP)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión a la base de datos:', err.message);
    });

module.exports = pool;