require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const { sql, getConnection } = require('../config/db');

let token; // Token para hacer pruebas

// Logging para obtener acceso
beforeAll(async () => {
    
    const res = await request(app).post('/mp/autenticacion/login').send({
        usuario: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD
    });
    
    token = res.body.token;
});

afterAll(async () => {
    const pool = await getConnection();
    await pool.close();
});

describe('GET /mp/expedientes', () => {

    test('Debe retornar 200 y una lista de expedientes (Array) cuando hay token', async () => {
        const response = await request(app)
            .get('/mp/expedientes')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('numero_expediente');
            expect(response.body[0]).toHaveProperty('descripcion_general');
        }
    });

    test('Debe retornar 401 si no se envía el token de autorización', async () => {
        const response = await request(app)
            .get('/mp/expedientes');

        expect(response.statusCode).toBe(401);
    });

    test('Debe permitir filtrar por estado', async () => {
        const response = await request(app)
            .get('/mp/expedientes?id_estado=1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        if(response.body.length > 0) {
            expect(response.body[0].id_estado).toBe(1);
        }
    });
});