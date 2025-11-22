require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, // Para conexiones locales.
        enableArithAbort: true,
        trustServerCertificate: true // Necesario para certificados autofirmados locales
    }
};

// Obtener el pool de conexiones
async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        throw error;
    }
}

module.exports = { sql, getConnection };