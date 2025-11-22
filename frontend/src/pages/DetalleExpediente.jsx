import Layout from '../components/Layout';
import useDetalleExpediente from '../hooks/useDetalleExpediente';
import useAuth from '../hooks/useAutenticacion';
import { useNavigate } from 'react-router-dom';

const DetalleExpediente = () => {
    const { 
        expediente, indicios, loading, error, 
        nuevoIndicio, handleChangeIndicio, agregarIndicio, cambiarEstado,
        nombreEstados, colorEstados
    } = useDetalleExpediente();
    
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Roles y Estados
    const ES_TECNICO = auth.user?.id_rol === 1;
    const ES_COORDINADOR = auth.user?.id_rol === 2;
    const ESTADO_ABIERTO = 1;
    const ESTADO_REVISION = 2;

    const handleFinalizarRevision = async () => {
        const exito = await cambiarEstado(2); // 2 = En Revisión
        if (exito) {
            navigate('/dashboard'); // Regresa al dashboard si todo salió bien
        }
    };

    if (loading) return <Layout><div className="text-center mt-20">Cargando caso...</div></Layout>;
    if (error) return <Layout><div className="text-red-500 mt-20 text-center">{error}</div></Layout>;

    return (
        <Layout>
            <div className="mb-6">
                <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-black mb-4">
                    ← Volver al listado
                </button>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{expediente.numero_expediente}</h1>
                        <p className="text-gray-500 mt-1">{expediente.descripcion_general}</p>
                    </div>

                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${colorEstados[expediente.id_estado] || 'bg-gray-100 text-gray-800'}`}>
                            Estado: {nombreEstados[expediente.id_estado] || 'Desconocido'}
                        </span>
                        <p className="text-xs text-gray-400 mt-2">Registrado: {new Date(expediente.fecha_registro).toLocaleDateString()}</p>
                    </div>
                </div>

                {expediente.justificacion_rechazo && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                        <p className="font-bold text-xs uppercase">Motivo del rechazo:</p>
                        <p>{expediente.justificacion_rechazo}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-800">Indicios Recolectados ({indicios.length})</h2>
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                            {indicios.map((indicio) => (
                                <div key={indicio.id_indicio} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium text-gray-900">{indicio.descripcion_indicio}</h3>
                                        <span className="text-xs text-gray-400">ID: {indicio.id_indicio}</span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                        <p><span className="font-medium text-gray-400">Color:</span> {indicio.color}</p>
                                        <p><span className="font-medium text-gray-400">Tamaño:</span> {indicio.tamano}</p>
                                        <p><span className="font-medium text-gray-400">Peso:</span> {indicio.peso}</p>
                                        <p><span className="font-medium text-gray-400">Ubicación:</span> {indicio.ubicacion_recoleccion}</p>
                                    </div>
                                </div>
                            ))}
                            {indicios.length === 0 && (
                                <p className="p-6 text-center text-gray-400 text-sm">No hay evidencias registradas.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">

                    {ES_TECNICO && expediente.id_estado === ESTADO_ABIERTO && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Agregar Nuevo Indicio</h3>
                            <form onSubmit={agregarIndicio} className="space-y-4">
                                <input name="descripcion_indicio" value={nuevoIndicio.descripcion_indicio} onChange={handleChangeIndicio} placeholder="Descripción del objeto" className="w-full px-3 py-2 border rounded-md text-sm" required />
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="color" value={nuevoIndicio.color} onChange={handleChangeIndicio} placeholder="Color" className="w-full px-3 py-2 border rounded-md text-sm" />
                                    <input name="tamano" value={nuevoIndicio.tamano} onChange={handleChangeIndicio} placeholder="Tamaño" className="w-full px-3 py-2 border rounded-md text-sm" />
                                </div>
                                <input name="peso" type="number" step="0.01" value={nuevoIndicio.peso} onChange={handleChangeIndicio} placeholder="Peso (ej. 10.5)" className="w-full px-3 py-2 border rounded-md text-sm" />
                                <input name="ubicacion_recoleccion" value={nuevoIndicio.ubicacion_recoleccion} onChange={handleChangeIndicio} placeholder="Ubicación de recolección" className="w-full px-3 py-2 border rounded-md text-sm" />
                                
                                <button type="submit" className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                                    Registrar Indicio
                                </button>
                            </form>
                        </div>
                    )}

                    {ES_TECNICO && expediente.id_estado === ESTADO_ABIERTO && indicios.length > 0 && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-800 mb-3">¿Has terminado de registrar toda la evidencia?</p>
                            <button 
                                onClick={handleFinalizarRevision}
                                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                                Finalizar y Enviar a Revisión
                            </button>
                        </div>
                    )}

                    {ES_COORDINADOR && expediente.id_estado === ESTADO_REVISION && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Revisión del Caso</h3>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => cambiarEstado(3)} // 3 = Aprobado
                                    className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700"
                                >
                                    Aprobar Expediente
                                </button>
                                <button 
                                    onClick={() => {
                                        const justificacion = prompt("Ingrese la justificación del rechazo:");
                                        if(justificacion) cambiarEstado(4, justificacion); // 4 = Rechazado
                                    }}
                                    className="w-full bg-red-600 text-white py-2 rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    Rechazar (Solicitar Corrección)
                                </button>
                            </div>
                        </div>
                    )}

                    {(expediente.id_estado === 3 || expediente.id_estado === 4) && (
                        <div className="p-4 bg-gray-50 border rounded-lg text-center text-sm text-gray-500">
                            Este expediente se encuentra finalizado o cerrado. No se permiten más modificaciones.
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
};

export default DetalleExpediente;