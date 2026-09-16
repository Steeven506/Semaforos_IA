import React from 'react';
import GrupoCard from './GrupoCard';

function GrupoList({ grupos, onEdit, onDelete, onUpdate, canEdit, canDelete }) {
  if (grupos.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay grupos registrados</p>
        <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
          Crea el primer grupo para organizar los semaforos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {grupos.map((grupo) => (
        <GrupoCard
          key={grupo.id}
          grupo={grupo}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default GrupoList;