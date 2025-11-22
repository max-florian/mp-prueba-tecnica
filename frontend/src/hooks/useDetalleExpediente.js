import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const useDetalleExpediente = () => {
    const { id } = useParams();
    
    // Estados de Datos
    const [expediente, setExpediente] = useState(null);
    const [indicios, setIndicios] = useState([]);
    
    // Estados de Carga/Error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado del Formulario de Indicios
    const [nuevoIndicio, setNuevoIndicio] = useState({
        descripcion_indicio: '',
        color: '',
        tamano: '',
        peso: '',
        ubicacion_recoleccion: ''
    });

    // Estados segun id de estado
    const nombreEstados = {
        1: 'Abierto',
        2: 'En Revisión',
        3: 'Aprobado',
        4: 'Rechazado'
    };

    // Color segun id de estado
    const colorEstados = {
        1: 'bg-blue-100 text-blue-800 border-blue-200',    // Abierto
        2: 'bg-yellow-100 text-yellow-800 border-yellow-200', // En Revisión
        3: 'bg-green-100 text-green-800 border-green-200',  // Aprobado
        4: 'bg-red-100 text-red-800 border-red-200'         // Rechazado
    };

    
    const cargarDatos = useCallback(async () => {
        try {
            const [resExp, resInd] = await Promise.all([
                axios.get(`http://localhost:9000/mp/expedientes/${id}`),
                axios.get(`http://localhost:9000/mp/indicios/expediente/${id}`)
            ]);

            setExpediente(resExp.data);
            setIndicios(resInd.data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar la información del caso.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const handleChangeIndicio = (e) => {
        const { name, value } = e.target;
        setNuevoIndicio(prev => ({ ...prev, [name]: value }));
    };

    const agregarIndicio = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/mp/indicios/crear', {
                ...nuevoIndicio,
                id_expediente: id
            });
            
            // Limpiar formulario y recargar lista
            setNuevoIndicio({
                descripcion_indicio: '', color: '', tamano: '', peso: '', ubicacion_recoleccion: ''
            });
            cargarDatos(); // Recargar para ver el nuevo indicio en la tabla
        } catch (err) {
            alert('Error al agregar indicio: ' + (err.response?.data?.msg || 'Error desconocido'));
        }
    };

    // Aprobar o rechazar expediente
    const cambiarEstado = async (nuevoEstadoId, justificacion = null) => {
        try {
            await axios.put(`http://localhost:9000/mp/expedientes/${id}/estado`, {
                id_nuevo_estado: nuevoEstadoId,
                justificacion_rechazo: justificacion
            });
            cargarDatos(); 
            return true;
        } catch (err) {
            alert('Error al cambiar estado');
            return false;
        }
    };

    return {
        expediente,
        indicios,
        loading,
        error,
        nuevoIndicio,
        handleChangeIndicio,
        agregarIndicio,
        cambiarEstado,
        nombreEstados,
        colorEstados
    };
};

export default useDetalleExpediente;