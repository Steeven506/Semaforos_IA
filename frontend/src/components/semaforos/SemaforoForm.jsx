import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

function SemaforoForm({ semaforo, intersections, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    interseccion_id: '',
    nombre: '',
    tipo: 'vehicular',
    estado: 'activo',
    latitud: '',
    longitud: '',
  });

  useEffect(() => {
    if (semaforo) {
      setFormData({
        interseccion_id: semaforo.interseccion_id || '',
        nombre: semaforo.nombre || '',
        tipo: semaforo.tipo || 'vehicular',
        estado: semaforo.estado || 'activo',
        latitud: semaforo.latitud || '',
        longitud: semaforo.longitud || '',
      });
    } else if (intersections.length > 0) {
      setFormData(prev => ({ ...prev, interseccion_id: intersections[0].id }));
    }
  }, [semaforo, intersections]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      interseccion_id: parseInt(formData.interseccion_id),
      latitud: formData.latitud ? parseFloat(formData.latitud) : null,
      longitud: formData.longitud ? parseFloat(formData.longitud) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {semaforo ? 'Editar Semaforo' : 'Nuevo Semaforo'}
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
              {intersections.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>

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
              placeholder="Semaforo Parque Principal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
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
              <label className="block text-sm font-medium text-gray-400 mb-2">
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

export default SemaforoForm;