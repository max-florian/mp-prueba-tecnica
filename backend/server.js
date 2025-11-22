const app = require('./app'); // Se importa la app configurada
const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});