import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from './useAutenticacion';

const useLogin = () => {
    const [formData, setFormData] = useState({ usuario: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth(); // Función login del contexto global
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Se limpian errores previos
        
        try {
            const res = await axios.post('http://localhost:9000/mp/autenticacion/login', formData);
            
            // Se actualiza el estado global
            login(res.data);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Error de conexión o credenciales inválidas');
        }
    };

    return {
        formData,
        error,
        handleChange,
        handleSubmit
    };
};

export default useLogin;