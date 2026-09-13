import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

function GrupoForm({ grupo, intersections, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    interseccion_id: '',
    nombre: '',
    descripcion: '',
    color_grupo: 'azul',
    direccion: 'Norte-Sur',
  });

  useEffect(() => {
    if (grupo) {
      setFormData({
        interseccion_id: grupo.interseccion_id || '',
        nombre: grupo.nombre || '',
        descripcion: grupo.descripcion || '',
        color_grupo: grupo.color_grupo || 'azul',
        direccion: grupo.direccion || 'Norte-Sur',
      });
    } else if (intersections.length > 0) {
      setFormData(prev => ({ ...prev, interseccion_id: intersections[0].id }));
    }
  }, [grupo, intersections]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      interseccion_id: parseInt(formData.interseccion_id),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {grupo ? 'Editar Grupo' : 'Nuevo Grupo'}
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
              Interseccion *
            </label>
            <select
              name="interseccion_id"
              value={formData.interseccion_id}
              onChange={handleChange}
              className="input-field"
              required
              disabled={!!grupo}
            >
              <option value="">Selecciona una interseccion</option>
              {intersections.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Nombre del Grupo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
              placeholder="Grupo Avenida"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Descripcion
            </label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="input-field"
              placeholder="Semaforos de la Av. Principal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Direccion *
              </label>
              <select
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Norte-Sur">Norte - Sur</option>
                <option value="Sur-Norte">Sur - Norte</option>
                <option value="Este-Oeste">Este - Oeste</option>
                <option value="Oeste-Este">Oeste - Este</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Color *
              </label>
              <select
                name="color_grupo"
                value={formData.color_grupo}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="azul">Azul</option>
                <option value="naranja">Naranja</option>
                <option value="verde">Verde</option>
                <option value="rojo">Rojo</option>
                <option value="purpura">Purpura</option>
              </select>
            </div>
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
  );
}

export default GrupoForm;