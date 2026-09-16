import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import grupoService from '../services/grupoService';
import intersectionService from '../services/intersectionService';
import { connectSocket } from '../services/socket';
import Header from '../components/layout/Header';
import GrupoList from '../components/grupos/GrupoList';
import GrupoForm from '../components/grupos/GrupoForm';
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';

function Grupos() {
  const { isAdmin, isOperador } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [filteredGrupos, setFilteredGrupos] = useState([]);
  const [intersections, setIntersections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntersection, setFilterIntersection] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = isAdmin() || isOperador();
  const canDelete = isAdmin();

  const fetchData = async () => {
    try {
      const [gruposData, intersectionsData] = await Promise.all([
        grupoService.getAll(),
        intersectionService.getAll()
      ]);
      setGrupos(gruposData);
      setFilteredGrupos(gruposData);
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
    if (socket) {
      socket.on('semaforo:cambio', () => {
        fetchData();
      });
      socket.emit('join:global');
    }

    return () => {
      if (socket) {
        socket.off('semaforo:cambio');
      }
    };
  }, []);

  useEffect(() => {
    let filtered = grupos;

    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.interseccion_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterIntersection) {
      filtered = filtered.filter(g => g.interseccion_id === parseInt(filterIntersection));
    }

    setFilteredGrupos(filtered);
  }, [searchTerm, filterIntersection, grupos]);

  const handleCreate = () => {
    setEditingGrupo(null);
    setShowForm(true);
  };

  const handleEdit = (grupo) => {
    setEditingGrupo(grupo);
    setShowForm(true);
  };

  const handleDelete = async (grupo) => {
    if (!window.confirm(`Eliminar el grupo "${grupo.nombre}"?`)) {
      return;
    }

    try {
      await grupoService.delete(grupo.id);
      setSuccess('Grupo eliminado exitosamente');
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
      if (editingGrupo) {
        await grupoService.update(editingGrupo.id, formData);
        setSuccess('Grupo actualizado exitosamente');
      } else {
        await grupoService.create(formData);
        setSuccess('Grupo creado exitosamente');
      }

      setShowForm(false);
      setEditingGrupo(null);
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
        <div className="text-gray-500 text-xl">Cargando grupos...</div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Grupos de Semaforos"
        subtitle={`${grupos.length} grupos registrados`}
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
              placeholder="Buscar grupos..."
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filterIntersection}
              onChange={(e) => setFilterIntersection(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">Todas las intersecciones</option>
              {intersections.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>

          {canEdit && (
            <button
              onClick={handleCreate}
              className="btn-success flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Grupo
            </button>
          )}
        </div>

        <GrupoList
          grupos={filteredGrupos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdate={fetchData}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      {showForm && (
        <GrupoForm
          grupo={editingGrupo}
          intersections={intersections}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingGrupo(null);
          }}
          loading={saving}
        />
      )}
    </div>
  );
}

export default Grupos;