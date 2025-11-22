import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user')),
        isAuthenticated: false,
        loading: true
    });

    // Configuración global de Axios para enviar el token automáticamente
    useEffect(() => {
        if (auth.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
            setAuth(prev => ({ ...prev, isAuthenticated: true, loading: false }));
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setAuth(prev => ({ ...prev, isAuthenticated: false, loading: false }));
        }
    }, [auth.token]);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuth({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            loading: false
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({
            token: null,
            user: null,
            isAuthenticated: false,
            loading: false
        });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;