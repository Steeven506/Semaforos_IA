import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import cameraService from '../services/cameraService';
import intersectionService from '../services/intersectionService';
import grupoService from '../services/grupoService';
import Header from '../components/layout/Header';
import CameraList from '../components/cameras/CameraList';
import CameraForm from '../components/cameras/CameraForm';
import { Plus, Search, Filter } from 'lucide-react';

function Camaras() {
  const { isAdmin, isOperador } = useAuth();
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = isAdmin() || isOperador();
  const canDelete = isAdmin();

  const fetchData = async () => {
    try {
      const [camerasData, intersectionsData, gruposData] = await Promise.all([
        cameraService.getAll(),
        intersectionService.getAll(),
        grupoService.getAll().catch(() => [])
      ]);
      setCameras(camerasData);
      setFilteredCameras(camerasData);
      setIntersections(intersectionsData);
      setGrupos(gruposData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = cameras;

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.interseccion_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(c => c.camera_type === filterType);
    }

    setFilteredCameras(filtered);
  }, [searchTerm, filterType, cameras]);

  const handleCreate = () => {
    setEditingCamera(null);
    setShowForm(true);
  };

  const handleEdit = (camera) => {
    setEditingCamera(camera);
    setShowForm(true);
  };

  const handleDelete = async (camera) => {
    if (!window.confirm(`Eliminar la camara "${camera.name}"?`)) {
      return;
    }

    try {
      await cameraService.delete(camera.id);
      setSuccess('Camara eliminada exitosamente');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al eliminar');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');

    try {
      if (editingCamera) {
        await cameraService.update(editingCamera.id, formData);
        setSuccess('Camara actualizada exitosamente');
      } else {
        await cameraService.create(formData);
        setSuccess('Camara creada exitosamente');
      }

      setShowForm(false);
      setEditingCamera(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Cargando camaras...</div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Camaras"
        subtitle={`${cameras.length} camaras registradas`}
      />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Buscar camaras..."
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">Todos los tipos</option>
              <option value="webcam">Webcam (PC)</option>
              <option value="wifi">WiFi (IP Webcam)</option>
              <option value="usb">USB (Celular)</option>
              <option value="ip">IP (RTSP/HTTP)</option>
            </select>
          </div>

          {canEdit && (
            <button
              onClick={handleCreate}
              className="btn-success flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Camara
            </button>
          )}
        </div>

        <CameraList
          cameras={filteredCameras}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {showForm && (
        <CameraForm
          camera={editingCamera}
          intersections={intersections}
          grupos={grupos}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCamera(null);
          }}
          loading={saving}
        />
      )}
    </div>
  );
}

export default Camaras;