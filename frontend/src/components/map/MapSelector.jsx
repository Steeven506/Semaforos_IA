import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, Save, MapPin } from 'lucide-react';

const OCANA_CENTER = [8.2377, -73.3560];

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={createPinIcon()} />
  );
}

function createPinIcon() {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin"></div>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
}

function CenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 18);
    }
  }, [position, map]);
  return null;
}

function MapSelector({ initialPosition, onConfirm, onCancel, title }) {
  const [position, setPosition] = useState(initialPosition || null);

  const handleConfirm = () => {
    if (position) {
      onConfirm({
        latitud: position[0].toFixed(6),
        longitud: position[1].toFixed(6),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div
        className="glass-card w-full max-w-4xl flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-dark-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {title || 'Selecciona la ubicacion'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-gray-500 mb-3">
            Haz click en el mapa para marcar la ubicacion
          </p>

          <div
            className="rounded-lg overflow-hidden border border-gray-200 dark:border-dark-700"
            style={{ height: 'clamp(250px, 45vh, 450px)' }}
          >
            <MapContainer
              center={position || OCANA_CENTER}
              zoom={position ? 18 : 14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <CenterMap position={position} />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>

          {position && (
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">
                <strong>Coordenadas seleccionadas:</strong>
                <br />
                Latitud: {position[0].toFixed(6)}
                <br />
                Longitud: {position[1].toFixed(6)}
              </p>
            </div>
          )}

          {!position && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-400">
                Haz click en el mapa para seleccionar una ubicacion
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-4 md:p-6 border-t border-gray-200 dark:border-dark-700 flex-shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!position}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
              position
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 cursor-not-allowed text-gray-400'
            }`}
          >
            <Save className="w-4 h-4" />
            Confirmar Ubicacion
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapSelector;