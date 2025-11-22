import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAutenticacion';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-200 h-16 px-8 flex items-center justify-between fixed w-full top-0 z-10">
            <div className="flex items-center gap-4">
                <div className="font-bold text-xl tracking-tight text-gray-900">DICRI</div>
                <span className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-500 font-medium">
                    Sistema de Evidencias
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{auth.user?.usuario}</p>
                    <p className="text-xs text-gray-500">{auth.user?.rol}</p>
                </div>
                
                <button 
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;