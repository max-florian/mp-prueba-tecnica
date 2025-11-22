require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rutas
const authRoutes = require('./routes/autenticacion');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/mp/autenticacion', authRoutes);

app.get('/', (req, res) => {
    res.send('Hola Mundo! :)');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});