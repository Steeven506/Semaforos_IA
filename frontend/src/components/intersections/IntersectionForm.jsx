import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import MapSelector from '../map/MapSelector';

function IntersectionForm({ intersection, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    latitud: '',
    longitud: '',
    direccion: '',
    ciudad: 'Ocana',
    pais: 'Colombia',
  });

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (intersection) {
      setFormData({
        nombre: intersection.nombre || '',
        descripcion: intersection.descripcion || '',
        latitud: intersection.latitud ? parseFloat(intersection.latitud).toFixed(6) : '',
        longitud: intersection.longitud ? parseFloat(intersection.longitud).toFixed(6) : '',
        direccion: intersection.direccion || '',
        ciudad: intersection.ciudad || 'Ocana',
        pais: intersection.pais || 'Colombia',
      });
    }
  }, [intersection]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleMapConfirm = (coords) => {
    setFormData({
      ...formData,
      latitud: coords.latitud,
      longitud: coords.longitud,
    });
    setShowMap(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
        <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {intersection ? 'Editar Interseccion' : 'Nueva Interseccion'}
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
                placeholder="Cruce Av. Francisco Fernandez de Contreras"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Descripcion
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Interseccion principal con la Calle del Colfer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Direccion
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="input-field"
                placeholder="Av. Francisco Fernandez de Contreras con Calle del Colfer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Pais
                </label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="input-field"
                />
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
          title="Selecciona la ubicacion de la interseccion"
        />
      )}
    </>
  );
}

export default IntersectionForm;