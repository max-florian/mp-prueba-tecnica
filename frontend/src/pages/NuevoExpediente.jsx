import Layout from '../components/Layout';
import useCrearExpediente from '../hooks/useCrearExpediente';
import { useNavigate } from 'react-router-dom';

const NuevoExpediente = () => {
    const { formData, loading, error, handleChange, handleSubmit } = useCrearExpediente();
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-sm text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-1"
                    >
                        ← Volver al Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Nuevo Expediente</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Ingrese los datos generales para iniciar un nuevo caso de investigación.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de Expediente (ID Único)
                            </label>
                            <input
                                type="text"
                                name="numero_expediente"
                                value={formData.numero_expediente}
                                onChange={handleChange}
                                placeholder="Ej. MP-2025-001"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Debe ser un identificador único en el sistema.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción del Caso
                            </label>
                            <textarea
                                name="descripcion_general"
                                value={formData.descripcion_general}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Describa brevemente el caso y las circunstancias..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                                    loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-black hover:bg-gray-800'
                                }`}
                            >
                                {loading ? 'Registrando...' : 'Crear Expediente'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default NuevoExpediente;