import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useCrearExpediente = () => {
    const [formData, setFormData] = useState({
        numero_expediente: '',
        descripcion_general: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validación de formulario
        if (!formData.numero_expediente || !formData.descripcion_general) {
            setError("Todos los campos son obligatorios");
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:9000/mp/expedientes/crear', formData);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            
            setError(err.response?.data?.msg || 'Error al crear el expediente');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        error,
        handleChange,
        handleSubmit
    };
};

export default useCrearExpediente;