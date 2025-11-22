const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Se lee el bearer token del header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    try {
        const tokenLimpio = token.replace('Bearer ', '');
        
        // Verificar el token
        const cifrado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        
        // Se añade el usuario a la request para usarlo en los controladores
        req.usuario = cifrado; 
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};