import useLogin from '../hooks/useLogin';

const Login = () => {
    const { formData, error, handleChange, handleSubmit } = useLogin();

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">DICRI</h1>
                    <p className="text-sm text-gray-500 mt-2">Sistema de Gestión de Evidencias</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                        <input
                            type="text"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-colors"
                            placeholder="Ej. admin"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium"
                    >
                        Ingresar
                    </button>
                </form>
                
                <div className="mt-6 text-center text-xs text-gray-400">
                    Ministerio Público de Guatemala
                </div>
            </div>
        </div>
    );
};

export default Login;