-- ============================================================================
-- MIGRACION: Grupos de Semaforos, Sincronizacion y Decisiones IA
-- Fecha: 2026-09-10
-- Descripcion: Sistema completo de IA para control de semaforos
-- ============================================================================

-- Tabla grupos_semaforos
CREATE TABLE IF NOT EXISTS grupos_semaforos (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    color_grupo VARCHAR(20) DEFAULT 'azul',
    direccion VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE
);

-- Agregar campo grupo_id a semaforos
ALTER TABLE semaforos ADD COLUMN IF NOT EXISTS grupo_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_semaforo_grupo'
    ) THEN
        ALTER TABLE semaforos 
        ADD CONSTRAINT fk_semaforo_grupo 
        FOREIGN KEY (grupo_id) REFERENCES grupos_semaforos(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Tabla sincronizacion_grupos
CREATE TABLE IF NOT EXISTS sincronizacion_grupos (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    grupo_a_id INTEGER NOT NULL,
    grupo_b_id INTEGER NOT NULL,
    offset_segundos INTEGER DEFAULT 0,
    desfase_actual INTEGER DEFAULT 0,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_a_id) REFERENCES grupos_semaforos(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_b_id) REFERENCES grupos_semaforos(id) ON DELETE CASCADE
);

-- Tabla estado_semaforos
CREATE TABLE IF NOT EXISTS estado_semaforos (
    id SERIAL PRIMARY KEY,
    semaforo_id INTEGER NOT NULL,
    interseccion_id INTEGER NOT NULL,
    grupo_id INTEGER,
    estado VARCHAR(20) NOT NULL DEFAULT 'verde',
    tiempo_restante INTEGER DEFAULT 0,
    vehiculos_esperando INTEGER DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semaforo_id) REFERENCES semaforos(id) ON DELETE CASCADE,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_id) REFERENCES grupos_semaforos(id) ON DELETE SET NULL
);

-- Tabla decisiones_ia
CREATE TABLE IF NOT EXISTS decisiones_ia (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    grupo_id INTEGER,
    accion VARCHAR(100) NOT NULL,
    presion_calculada DECIMAL(10,2),
    tiempo_verde INTEGER,
    algoritmo VARCHAR(50),
    justificacion TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_id) REFERENCES grupos_semaforos(id) ON DELETE SET NULL
);

-- Tabla reportes_ia
CREATE TABLE IF NOT EXISTS reportes_ia (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255),
    contenido TEXT,
    sugerencias TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE
);

-- Agregar grupo_id a cameras
ALTER TABLE cameras ADD COLUMN IF NOT EXISTS grupo_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_camera_grupo'
    ) THEN
        ALTER TABLE cameras 
        ADD CONSTRAINT fk_camera_grupo 
        FOREIGN KEY (grupo_id) REFERENCES grupos_semaforos(id) ON DELETE SET NULL;
    END IF;
END $$;




-- Indices
CREATE INDEX IF NOT EXISTS idx_grupos_interseccion ON grupos_semaforos(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_semaforos_grupo ON semaforos(grupo_id);
CREATE INDEX IF NOT EXISTS idx_sincronizacion_interseccion ON sincronizacion_grupos(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_estado_semaforos_semaforo ON estado_semaforos(semaforo_id);
CREATE INDEX IF NOT EXISTS idx_estado_semaforos_timestamp ON estado_semaforos(timestamp);
CREATE INDEX IF NOT EXISTS idx_decisiones_ia_interseccion ON decisiones_ia(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_decisiones_ia_timestamp ON decisiones_ia(timestamp);
CREATE INDEX IF NOT EXISTS idx_reportes_ia_interseccion ON reportes_ia(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_reportes_ia_fecha ON reportes_ia(fecha);
CREATE INDEX IF NOT EXISTS idx_cameras_grupo ON cameras(grupo_id);