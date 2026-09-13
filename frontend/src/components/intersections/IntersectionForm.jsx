import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

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

  useEffect(() => {
    if (intersection) {
      setFormData({
        nombre: intersection.nombre || '',
        descripcion: intersection.descripcion || '',
        latitud: intersection.latitud || '',
        longitud: intersection.longitud || '',
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {intersection ? 'Editar Interseccion' : 'Nueva Interseccion'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-dark-700 rounded-lg transition text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
              placeholder="Parque Principal de Ocana"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Descripcion
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Cruce principal del centro de Ocana"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Latitud
              </label>
              <input
                type="number"
                step="any"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                className="input-field"
                placeholder="8.2377"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Longitud
              </label>
              <input
                type="number"
                step="any"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                className="input-field"
                placeholder="-73.3560"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Direccion
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="input-field"
              placeholder="Calle 11 con Carrera 12"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
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
              <label className="block text-sm font-medium text-gray-400 mb-2">
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition font-medium"
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
  );
}

export default IntersectionForm;