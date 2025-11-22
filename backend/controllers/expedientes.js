const { sql, getConnection } = require('../config/db');


const crearExpediente = async (req, res) => {
    // Se extraen datos del body y el ID del usuario del token
    const { numero_expediente, descripcion_general } = req.body;
    const id_usuario_registra = req.usuario.id; 

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('numero_expediente', sql.VarChar, numero_expediente)
            .input('descripcion_general', sql.VarChar, descripcion_general)
            .input('id_usuario_registra', sql.Int, id_usuario_registra)
            .execute('sp_crear_expediente');

        res.json({ 
            msg: 'Expediente creado correctamente',
            id_expediente: result.recordset[0].id_expediente 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear expediente');
    }
};


const obtenerExpedientes = async (req, res) => {
    const { fecha_inicio, fecha_fin, id_estado } = req.query;

    try {
        const pool = await getConnection();
        const request = pool.request();

        // Se agregan parámetros solo si vienen en el request
        if (fecha_inicio) request.input('fecha_inicio', sql.DateTime, fecha_inicio);
        if (fecha_fin) request.input('fecha_fin', sql.DateTime, fecha_fin);
        if (id_estado) request.input('id_estado', sql.Int, id_estado);

        const result = await request.execute('sp_obtener_expedientes');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener expedientes');
    }
};


const obtenerExpedientePorId = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_expediente', sql.Int, id)
            .execute('sp_obtener_expediente_por_id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Expediente no encontrado' });
        }
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
};


const cambiarEstadoExpediente = async (req, res) => {
    const { id } = req.params;
    const { id_nuevo_estado, justificacion_rechazo } = req.body;
    const id_usuario_revisa = req.usuario.id; // Del token

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_expediente', sql.Int, id)
            .input('id_usuario_revisa', sql.Int, id_usuario_revisa)
            .input('id_nuevo_estado', sql.Int, id_nuevo_estado)
            .input('justificacion_rechazo', sql.VarChar, justificacion_rechazo) // Puede ser null si aprueba
            .execute('sp_cambiar_estado_expediente');

        res.json({ msg: 'Estado del expediente actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar estado');
    }
};


const editarExpediente = async (req, res) => {
    const { id } = req.params;
    const { numero_expediente, descripcion_general } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_expediente', sql.Int, id)
            .input('numero_expediente', sql.VarChar, numero_expediente)
            .input('descripcion_general', sql.VarChar, descripcion_general)
            .execute('sp_editar_expediente');

        res.json({ msg: 'Expediente actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al editar expediente');
    }
};


const eliminarExpediente = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_expediente', sql.Int, id)
            .execute('sp_eliminar_expediente');

        res.json({ msg: 'Expediente eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar expediente');
    }
};

module.exports = {
    crearExpediente,
    obtenerExpedientes,
    obtenerExpedientePorId,
    cambiarEstadoExpediente,
    editarExpediente,
    eliminarExpediente
};