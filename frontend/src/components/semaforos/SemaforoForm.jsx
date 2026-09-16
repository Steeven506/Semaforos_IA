import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import MapSelector from '../map/MapSelector';

function SemaforoForm({ semaforo, intersections, grupos, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    interseccion_id: '',
    grupo_id: '',
    nombre: '',
    tipo: 'vehicular',
    estado: 'activo',
    latitud: '',
    longitud: '',
  });

  const [showMap, setShowMap] = useState(false);

  const safeIntersections = intersections || [];
  const safeGrupos = grupos || [];

  useEffect(() => {
    if (semaforo) {
      setFormData({
        interseccion_id: semaforo.interseccion_id || '',
        grupo_id: semaforo.grupo_id || '',
        nombre: semaforo.nombre || '',
        tipo: semaforo.tipo || 'vehicular',
        estado: semaforo.estado || 'activo',
        latitud: semaforo.latitud ? parseFloat(semaforo.latitud).toFixed(6) : '',
        longitud: semaforo.longitud ? parseFloat(semaforo.longitud).toFixed(6) : '',
      });
    } else if (safeIntersections.length > 0) {
      setFormData(prev => ({ ...prev, interseccion_id: safeIntersections[0].id }));
    }
  }, [semaforo, safeIntersections]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      interseccion_id: formData.interseccion_id ? parseInt(formData.interseccion_id) : null,
      grupo_id: formData.grupo_id ? parseInt(formData.grupo_id) : null,
      latitud: formData.latitud ? parseFloat(formData.latitud) : null,
      longitud: formData.longitud ? parseFloat(formData.longitud) : null,
    });
  };

  const handleMapConfirm = (coords) => {
    setFormData({
      ...formData,
      latitud: coords.latitud,
      longitud: coords.longitud,
    });
    setShowMap(false);
  };

  const gruposFiltrados = formData.interseccion_id
    ? safeGrupos.filter(g => g.interseccion_id === parseInt(formData.interseccion_id))
    : safeGrupos;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {semaforo ? 'Editar Semaforo' : 'Nuevo Semaforo'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Semaforo Parque Principal"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Interseccion *
                </label>
                <select
                  name="interseccion_id"
                  value={formData.interseccion_id}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona una interseccion</option>
                  {safeIntersections.map((i) => (
                    <option key={i.id} value={i.id}>{i.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Grupo de Semaforos
                </label>
                <select
                  name="grupo_id"
                  value={formData.grupo_id}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Sin grupo</option>
                  {gruposFiltrados.map((g) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="vehicular">Vehicular</option>
                  <option value="peatonal">Peatonal</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="activo">Activo</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Ubicacion Geografica
              </label>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                <MapPin className="w-5 h-5" />
                {formData.latitud && formData.longitud
                  ? 'Cambiar Ubicacion en el Mapa'
                  : 'Seleccionar Ubicacion en el Mapa'}
              </button>

              {formData.latitud && formData.longitud && (
                <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-400">
                    Latitud: {formData.latitud} | Longitud: {formData.longitud}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showMap && (
        <MapSelector
          initialPosition={
            formData.latitud && formData.longitud
              ? [parseFloat(formData.latitud), parseFloat(formData.longitud)]
              : null
          }
          onConfirm={handleMapConfirm}
          onCancel={() => setShowMap(false)}
          title="Selecciona la ubicacion del semaforo"
        />
      )}
    </>
  );
}

export default SemaforoForm;