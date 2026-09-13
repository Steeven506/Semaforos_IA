import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import emergenciaService from '../services/emergenciaService';
import intersectionService from '../services/intersectionService';
import { connectSocket } from '../services/socket';
import Header from '../components/layout/Header';
import EmergenciaList from '../components/emergencias/EmergenciaList';
import EmergenciaForm from '../components/emergencias/EmergenciaForm';
import { Plus, Search, Filter, AlertTriangle } from 'lucide-react';

function Emergencias() {
  const { isAdmin, isOperador } = useAuth();
  const [emergencias, setEmergencias] = useState([]);
  const [filteredEmergencias, setFilteredEmergencias] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmergencia, setEditingEmergencia] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = isAdmin() || isOperador();
  const canDelete = isAdmin();

  const fetchData = async () => {
    try {
      const [emergenciasData, intersectionsData] = await Promise.all([
        emergenciaService.getAll(),
        intersectionService.getAll()
      ]);
      setEmergencias(emergenciasData);
      setFilteredEmergencias(emergenciasData);
      setIntersections(intersectionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = connectSocket();
    socket.emit('join:global');

    socket.on('emergencia:new', (data) => {
      setEmergencias(prev => [data, ...prev]);
      setSuccess(`Nueva emergencia: ${data.tipo}`);
      setTimeout(() => setSuccess(''), 3000);
    });

    return () => {
      socket.off('emergencia:new');
    };
  }, []);

  useEffect(() => {
    let filtered = emergencias;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.interseccion_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEstado) {
      filtered = filtered.filter(e => e.estado === filterEstado);
    }

    if (filterTipo) {
      filtered = filtered.filter(e => e.tipo === filterTipo);
    }

    setFilteredEmergencias(filtered);
  }, [searchTerm, filterEstado, filterTipo, emergencias]);

  const handleCreate = () => {
    setEditingEmergencia(null);
    setShowForm(true);
  };

  const handleEdit = (emergencia) => {
    setEditingEmergencia(emergencia);
    setShowForm(true);
  };

  const handleResolve = async (emergencia) => {
    if (!window.confirm(`Marcar la emergencia #${emergencia.id} como resuelta?`)) {
      return;
    }

    try {
      await emergenciaService.update(emergencia.id, { estado: 'resuelta' });
      setSuccess('Emergencia resuelta exitosamente');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al resolver');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (emergencia) => {
    if (!window.confirm(`Eliminar la emergencia #${emergencia.id}?`)) {
      return;
    }

    try {
      await emergenciaService.delete(emergencia.id);
      setSuccess('Emergencia eliminada exitosamente');
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
      if (editingEmergencia) {
        await emergenciaService.update(editingEmergencia.id, formData);
        setSuccess('Emergencia actualizada exitosamente');
      } else {
        await emergenciaService.create(formData);
        setSuccess('Emergencia creada exitosamente');
      }

      setShowForm(false);
      setEditingEmergencia(null);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const activas = emergencias.filter(e => e.estado === 'activa').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-xl">Cargando emergencias...</div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Emergencias" 
        subtitle={`${emergencias.length} emergencias registradas | ${activas} activas`}
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

        {activas > 0 && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <div>
              <p className="text-red-400 font-bold">
                {activas} emergencia{activas > 1 ? 's' : ''} activa{activas > 1 ? 's' : ''}
              </p>
              <p className="text-red-300 text-sm">Requiere atencion inmediata</p>
            </div>
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
              placeholder="Buscar emergencias..."
            />
          </div>

          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activas</option>
              <option value="resuelta">Resueltas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          <div className="relative min-w-[180px]">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="input-field"
            >
              <option value="">Todos los tipos</option>
              <option value="ambulancia">Ambulancia</option>
              <option value="bomberos">Bomberos</option>
              <option value="policia">Policia</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {canEdit && (
            <button
              onClick={handleCreate}
              className="btn-success flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Emergencia
            </button>
          )}
        </div>

        <EmergenciaList
          emergencias={filteredEmergencias}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResolve={handleResolve}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {showForm && (
        <EmergenciaForm
          emergencia={editingEmergencia}
          intersections={intersections}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingEmergencia(null);
          }}
          loading={saving}
        />
      )}
    </div>
  );
}

export default Emergencias;