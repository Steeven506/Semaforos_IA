import React from 'react';
import EmergenciaCard from './EmergenciaCard';

function EmergenciaList({ emergencias, onEdit, onDelete, onResolve, canEdit, canDelete }) {
  if (emergencias.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay emergencias registradas</p>
        <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
          Las emergencias apareceran aqui cuando se registren
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {emergencias.map((emergencia) => (
        <EmergenciaCard
          key={emergencia.id}
          emergencia={emergencia}
          onEdit={onEdit}
          onDelete={onDelete}
          onResolve={onResolve}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default EmergenciaList;