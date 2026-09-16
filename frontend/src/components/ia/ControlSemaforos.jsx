import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import iaService from '../../services/iaService';
import { connectSocket } from '../../services/socket';
import { TrafficCone, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

function ControlSemaforos({ interseccion_id, onUpdate }) {
  const { isAdmin } = useAuth();
  const [semaforos, setSemaforos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchSemaforos = async () => {
    try {
      const data = await iaService.getEstadosSemaforos(interseccion_id);
      setSemaforos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interseccion_id) {
      fetchSemaforos();

      const socket = connectSocket();
      if (socket) {
        socket.on('semaforo:cambio', () => {
          fetchSemaforos();
        });
        socket.emit('join:global');
      }

      return () => {
        if (socket) {
          socket.off('semaforo:cambio');
        }
      };
    }
  }, [interseccion_id]);

  const handleChangeSemaforo = async (semaforo_id, estado) => {
    try {
      await iaService.cambiarEstadoSemaforo(semaforo_id, estado);
      setSuccess(`Semaforo cambiado a ${estado}`);
      fetchSemaforos();
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cambiar estado');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChangeGrupo = async (grupo_id, estado) => {
    try {
      await iaService.cambiarEstadoGrupo(grupo_id, estado);
      setSuccess(`Grupo cambiado a ${estado}`);
      fetchSemaforos();
      if (onUpdate) onUpdate();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al cambiar grupo');
      setTimeout(() => setError(''), 3000);
    }
  };

  const grupos = {};
  semaforos.forEach(s => {
    const key = s.grupo_id || 'sin-grupo';
    if (!grupos[key]) {
      grupos[key] = {
        id: s.grupo_id,
        nombre: s.grupo_nombre || 'Sin Grupo',
        color: s.color_grupo || 'gris',
        semaforos: []
      };
    }
    grupos[key].semaforos.push(s);
  });

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'verde':
      case 'green':
        return 'bg-green-500';
      case 'amarillo':
      case 'yellow':
        return 'bg-yellow-500';
      case 'rojo':
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-center py-4">Cargando semaforos...</div>;
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrafficCone className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Control de Semaforos
        </h2>
        <button
          onClick={fetchSemaforos}
          className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
        {!isAdmin() && (
          <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
            Solo Admin
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {Object.values(grupos).length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay semaforos configurados</p>
      ) : (
        <div className="space-y-6">
          {Object.values(grupos).map((grupo) => (
            <div key={grupo.id || 'sin-grupo'} className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {grupo.nombre}
                  </h3>
                  <span className="text-xs text-gray-500">
                    ({grupo.semaforos.length} semaforos)
                  </span>
                </div>

                {isAdmin() && grupo.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChangeGrupo(grupo.id, 'verde')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition"
                    >
                      Verde
                    </button>
                    <button
                      onClick={() => handleChangeGrupo(grupo.id, 'amarillo')}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition"
                    >
                      Amarillo
                    </button>
                    <button
                      onClick={() => handleChangeGrupo(grupo.id, 'rojo')}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition"
                    >
                      Rojo
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {grupo.semaforos.map((semaforo) => (
                  <div key={semaforo.id} className="p-3 bg-gray-100 dark:bg-dark-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {semaforo.nombre}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getEstadoColor(semaforo.ultimo_control_estado || semaforo.estado)}`}></div>
                    </div>
                    <p className="text-xs text-gray-500 capitalize mb-2">
                      {semaforo.ultimo_control_estado || semaforo.estado}
                    </p>

                    {isAdmin() && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleChangeSemaforo(semaforo.id, 'verde')}
                          className="flex-1 py-1 bg-green-600/80 hover:bg-green-600 text-white text-xs rounded"
                        >
                          V
                        </button>
                        <button
                          onClick={() => handleChangeSemaforo(semaforo.id, 'amarillo')}
                          className="flex-1 py-1 bg-yellow-600/80 hover:bg-yellow-600 text-white text-xs rounded"
                        >
                          A
                        </button>
                        <button
                          onClick={() => handleChangeSemaforo(semaforo.id, 'rojo')}
                          className="flex-1 py-1 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded"
                        >
                          R
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ControlSemaforos;