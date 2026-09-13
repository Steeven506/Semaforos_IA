import React from 'react';
import CameraCard from './CameraCard';

function CameraList({ cameras, onEdit, onDelete, canEdit, canDelete }) {
  if (cameras.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-500 text-lg">No hay camaras registradas</p>
        <p className="text-gray-600 text-sm mt-2">Crea la primera camara para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {cameras.map((camera) => (
        <CameraCard
          key={camera.id}
          camera={camera}
          onEdit={onEdit}
          onDelete={onDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

export default CameraList;