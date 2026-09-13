import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

function CameraForm({ camera, intersections, sensors, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    interseccion_id: '',
    sensor_id: '',
    name: '',
    url: '',
    camera_type: 'webcam',
    activo: true,
  });

  useEffect(() => {
    if (camera) {
      setFormData({
        interseccion_id: camera.interseccion_id || '',
        sensor_id: camera.sensor_id || '',
        name: camera.name || '',
        url: camera.url || '',
        camera_type: camera.camera_type || 'webcam',
        activo: camera.activo !== undefined ? camera.activo : true,
      });
    } else if (intersections.length > 0) {
      setFormData(prev => ({ ...prev, interseccion_id: intersections[0].id }));
    }
  }, [camera, intersections]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      interseccion_id: formData.interseccion_id ? parseInt(formData.interseccion_id) : null,
      sensor_id: formData.sensor_id ? parseInt(formData.sensor_id) : null,
    });
  };

  const getPlaceholder = (tipo) => {
    switch (tipo) {
      case 'webcam':
        return '0, 1, 2... (indice de camara)';
      case 'wifi':
        return 'http://192.168.1.20:8080/video';
      case 'usb':
        return 'http://127.0.0.1:8080/video';
      case 'ip':
        return 'rtsp://192.168.1.100:554/stream';
      default:
        return 'URL o ID de la camara';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-bold text-white">
            {camera ? 'Editar Camara' : 'Nueva Camara'}
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Camara Parque Principal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Interseccion
              </label>
              <select
                name="interseccion_id"
                value={formData.interseccion_id}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Sin interseccion</option>
                {intersections.map((i) => (
                  <option key={i.id} value={i.id}>{i.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sensor
              </label>
              <select
                name="sensor_id"
                value={formData.sensor_id}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Sin sensor</option>
                {sensors.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tipo de Camara *
            </label>
            <select
              name="camera_type"
              value={formData.camera_type}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="webcam">Webcam (PC)</option>
              <option value="wifi">WiFi (IP Webcam)</option>
              <option value="usb">USB (Celular)</option>
              <option value="ip">IP (RTSP/HTTP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              URL o ID *
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="input-field"
              placeholder={getPlaceholder(formData.camera_type)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {getPlaceholder(formData.camera_type)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="activo" className="text-sm text-gray-400">
              Camara activa
            </label>
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

export default CameraForm;