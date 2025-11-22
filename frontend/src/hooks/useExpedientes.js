import { useState, useEffect, useCallback } from 'react'; // Agregamos useCallback
import axios from 'axios';
import useAuth from './useAutenticacion';

const useExpedientes = () => {
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth(); 

    const fetchExpedientes = useCallback(async (filtros = {}) => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:9000/mp/expedientes', {
                params: filtros
            });
            
            setExpedientes(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los expedientes.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Carga inicial (sin filtros)
    useEffect(() => {
        if (!auth.loading && auth.token) {
            fetchExpedientes();
        }
    }, [auth.loading, auth.token, fetchExpedientes]);

    return { expedientes, loading, error, filtrar: fetchExpedientes };
};

export default useExpedientes;