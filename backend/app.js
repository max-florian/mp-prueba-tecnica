require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rutas
const authRoutes = require('./routes/autenticacion');
const expedientesRoutes = require('./routes/expedientes');
const indiciosRoutes = require('./routes/indicios');

const app = express();
const port = process.env.PORT || 9000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/mp/autenticacion', authRoutes);
app.use('/mp/expedientes', expedientesRoutes);
app.use('/mp/indicios', indiciosRoutes);

app.get('/', (req, res) => {
    res.send('Hola Mundo! :)');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});