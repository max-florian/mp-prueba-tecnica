const { sql, getConnection } = require('../config/db');


const crearIndicio = async (req, res) => {
    const { 
        id_expediente, 
        descripcion_indicio, 
        color, 
        tamano, 
        peso, 
        ubicacion_recoleccion 
    } = req.body;

    // El ID del técnico se obtiene automáticamente del token
    const id_usuario_registra = req.usuario.id;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_expediente', sql.Int, id_expediente)
            .input('descripcion_indicio', sql.VarChar, descripcion_indicio)
            .input('color', sql.VarChar, color)
            .input('tamano', sql.VarChar, tamano)
            .input('peso', sql.Decimal(10, 2), peso)
            .input('ubicacion_recoleccion', sql.VarChar, ubicacion_recoleccion)
            .input('id_usuario_registra', sql.Int, id_usuario_registra)
            .execute('sp_crear_indicio');

        res.json({ msg: 'Indicio registrado correctamente' });
    } catch (error) {
        console.error('Error al crear indicio:', error);
        res.status(500).send('Error al registrar el indicio');
    }
};


const obtenerIndiciosPorExpediente = async (req, res) => {
    const { id_expediente } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_expediente', sql.Int, id_expediente)
            .execute('sp_listar_indicios_por_expediente');

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener indicios:', error);
        res.status(500).send('Error al obtener los indicios');
    }
};


const obtenerIndicioPorId = async (req, res) => {
    const { id } = req.params; // id del indicio

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id_indicio', sql.Int, id)
            .execute('sp_obtener_indicio_por_id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Indicio no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor');
    }
};


const editarIndicio = async (req, res) => {
    const { id } = req.params; // id del indicio
    const { 
        descripcion_indicio, 
        color, 
        tamano, 
        peso, 
        ubicacion_recoleccion 
    } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_indicio', sql.Int, id)
            .input('descripcion_indicio', sql.VarChar, descripcion_indicio)
            .input('color', sql.VarChar, color)
            .input('tamano', sql.VarChar, tamano)
            .input('peso', sql.Decimal(10, 2), peso)
            .input('ubicacion_recoleccion', sql.VarChar, ubicacion_recoleccion)
            .execute('sp_editar_indicio');

        res.json({ msg: 'Indicio actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar indicio:', error);
        res.status(500).send('Error al actualizar el indicio');
    }
};


const eliminarIndicio = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('id_indicio', sql.Int, id)
            .execute('sp_eliminar_indicio');

        res.json({ msg: 'Indicio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar indicio:', error);
        res.status(500).send('Error al eliminar');
    }
};

module.exports = {
    crearIndicio,
    obtenerIndiciosPorExpediente,
    obtenerIndicioPorId,
    editarIndicio,
    eliminarIndicio
};