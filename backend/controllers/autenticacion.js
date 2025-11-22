const { sql, getConnection } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ msg: 'Favor de completar datos de inicio de sesión' });
    }

    try {
        const pool = await getConnection();
        
        // Se busca el usuario mediante el procedimiento almacenado
        const result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .execute('sp_login_usuario');

        if (result.recordset.length === 0) {
            return res.status(401).json({ msg: 'Credenciales inválidas' });
        }

        const user = result.recordset[0];

        // Comparacion de contraseña con el hash de la BD
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ msg: 'Credenciales inválidas' });
        }

        // Generar JWT
        const payload = {
            id: user.id_usuario,
            usuario: user.usuario,
            rol: user.nombre_rol,
            id_rol: user.id_rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h' // El token expira en 8 horas
        });

        // Retornar token y datos del usuario
        res.json({
            msg: 'Login exitoso',
            token, 
            user: payload
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).send('Error del servidor');
    }
};

module.exports = { login };