import { useState } from 'react'; // Importar useState
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useExpedientes from '../hooks/useExpedientes';
import useAuth from '../hooks/useAutenticacion';

const Dashboard = () => {
    
    const { expedientes, loading, error, filtrar } = useExpedientes();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        id_estado: ''
    });

    const handleChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    };

    const handleBuscar = () => {
        filtrar(filtros);
    };

    const handleLimpiar = () => {
        const estadoLimpio = { fecha_inicio: '', fecha_fin: '', id_estado: '' };
        setFiltros(estadoLimpio);
        filtrar(estadoLimpio); // Recargar sin filtros
    };

    // Helper de estilos
    const getEstadoBadge = (estado) => {
        const styles = {
            'abierto': 'bg-blue-50 text-blue-700 border-blue-100',
            'en revisión': 'bg-yellow-50 text-yellow-700 border-yellow-100',
            'aprobado': 'bg-green-50 text-green-700 border-green-100',
            'rechazado': 'bg-red-50 text-red-700 border-red-100'
        };
        return styles[estado?.toLowerCase()] || 'bg-gray-100 text-gray-600';
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expedientes</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestión y control de evidencias</p>
                </div>
                
                {auth.user?.id_rol === 1 && (
                    <button 
                        onClick={() => navigate('/crear-expediente')}
                        className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        + Nuevo Expediente
                    </button>
                )}
            </div>

            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">

                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fecha Desde</label>
                        <input 
                            type="date" 
                            name="fecha_inicio"
                            value={filtros.fecha_inicio}
                            onChange={handleChange}
                            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
                        />
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Fecha Hasta</label>
                        <input 
                            type="date" 
                            name="fecha_fin"
                            value={filtros.fecha_fin}
                            onChange={handleChange}
                            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
                        />
                    </div>

                    <div className="w-full md:w-auto flex-grow max-w-xs">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                        <select 
                            name="id_estado"
                            value={filtros.id_estado}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black outline-none bg-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="1">Abierto</option>
                            <option value="2">En Revisión</option>
                            <option value="3">Aprobado</option>
                            <option value="4">Rechazado</option>
                        </select>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={handleBuscar}
                            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex-1 md:flex-none"
                        >
                            Filtrar
                        </button>
                        <button 
                            onClick={handleLimpiar}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex-1 md:flex-none"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400 bg-white border border-gray-200 rounded-lg">
                    Cargando resultados...
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">{error}</div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">No. Expediente</th>
                                <th className="px-6 py-3">Descripción</th>
                                <th className="px-6 py-3">Fecha Registro</th>
                                <th className="px-6 py-3">Técnico</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {expedientes.map((exp) => (
                                <tr key={exp.id_expediente} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {exp.numero_expediente}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                                        {exp.descripcion_general}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(exp.fecha_registro).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {exp.nombre_tecnico}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs border ${getEstadoBadge(exp.estado_descripcion)}`}>
                                            {exp.estado_descripcion}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => navigate(`/expedientes/${exp.id_expediente}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                                        >
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            
                            {expedientes.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                                        No se encontraron expedientes con estos filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;