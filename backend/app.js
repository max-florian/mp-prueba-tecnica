require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/autenticacion');
const expedienteRoutes = require('./routes/expedientes'); // Asegúrate que la ruta coincida
const indicioRoutes = require('./routes/indicios');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/mp/autenticacion', authRoutes);
app.use('/mp/expedientes', expedienteRoutes);
app.use('/mp/indicios', indicioRoutes);

app.get('/', (req, res) => {
    res.send('Hola Mundo! :)');
});

module.exports = app;