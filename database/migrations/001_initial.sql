-- ============================================================================
-- SCRIPT DE MIGRACION INICIAL
-- Proyecto: Traffic Intelligence System
-- Fecha: 10 de Septiembre de 2026
-- Descripcion: Creacion de todas las tablas del sistema
-- ============================================================================

-- ============================================================================
-- TABLA: roles
-- Descripcion: Almacena los roles de los usuarios del sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLA: usuarios
-- Descripcion: Almacena los usuarios del sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    telefono VARCHAR(50),
    verificado BOOLEAN DEFAULT FALSE,
    token_verificacion VARCHAR(255),
    token_recuperacion VARCHAR(255),
    token_expiracion TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ============================================================================
-- TABLA: intersecciones
-- Descripcion: Almacena las intersecciones viales
-- ============================================================================
CREATE TABLE IF NOT EXISTS intersecciones (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    direccion VARCHAR(500),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ============================================================================
-- TABLA: semaforos
-- Descripcion: Almacena los semaforos de cada interseccion
-- ============================================================================
CREATE TABLE IF NOT EXISTS semaforos (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo',
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: fases
-- Descripcion: Almacena las fases de cada semaforo
-- ============================================================================
CREATE TABLE IF NOT EXISTS fases (
    id SERIAL PRIMARY KEY,
    semaforo_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    duracion INTEGER NOT NULL,
    orden INTEGER NOT NULL,
    color VARCHAR(20) DEFAULT 'verde',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semaforo_id) REFERENCES semaforos(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: sensores
-- Descripcion: Almacena los sensores de cada interseccion
-- ============================================================================
CREATE TABLE IF NOT EXISTS sensores (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo',
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: cameras
-- Descripcion: Almacena las camaras del sistema
-- ============================================================================
DROP TABLE IF EXISTS cameras CASCADE;

CREATE TABLE cameras (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER,
    sensor_id INTEGER,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    camera_type VARCHAR(50) DEFAULT 'webcam',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE SET NULL,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLA: detections_log
-- Descripcion: Almacena las detecciones por minuto
-- ============================================================================
DROP TABLE IF EXISTS detections_log CASCADE;

CREATE TABLE detections_log (
    id SERIAL PRIMARY KEY,
    camera_id INTEGER NOT NULL,
    interseccion_id INTEGER,
    sensor_id INTEGER,
    timestamp TIMESTAMP NOT NULL,
    personas INTEGER DEFAULT 0,
    carros INTEGER DEFAULT 0,
    motos INTEGER DEFAULT 0,
    buses INTEGER DEFAULT 0,
    camiones INTEGER DEFAULT 0,
    total INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE SET NULL,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLA: emergencias
-- Descripcion: Almacena los eventos de emergencia
-- ============================================================================
CREATE TABLE IF NOT EXISTS emergencias (
    id SERIAL PRIMARY KEY,
    interseccion_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'activa',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resuelto_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interseccion_id) REFERENCES intersecciones(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: logs_sistema
-- Descripcion: Almacena los logs de acciones del sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs_sistema (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    accion VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ip VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDICES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role_id);
CREATE INDEX IF NOT EXISTS idx_intersecciones_usuario ON intersecciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_semaforos_interseccion ON semaforos(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_fases_semaforo ON fases(semaforo_id);
CREATE INDEX IF NOT EXISTS idx_sensores_interseccion ON sensores(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_cameras_interseccion ON cameras(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_detections_camera ON detections_log(camera_id);
CREATE INDEX IF NOT EXISTS idx_detections_timestamp ON detections_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_detections_interseccion ON detections_log(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_emergencias_interseccion ON emergencias(interseccion_id);
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON logs_sistema(usuario_id);

-- ============================================================================
-- DATOS INICIALES
-- ============================================================================

-- Roles
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema con acceso total'),
('operador', 'Operador que gestiona semaforos y sensores'),
('visualizador', 'Usuario que solo visualiza datos y reportes')
ON CONFLICT (nombre) DO NOTHING;

-- Usuario admin de prueba
INSERT INTO usuarios (role_id, email, password, nombre, apellido, verificado) VALUES
(1, 'admin@traffic.com', 'admin123', 'Admin', 'Sistema', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Interseccion de prueba
INSERT INTO intersecciones (usuario_id, nombre, descripcion, latitud, longitud, direccion, ciudad, pais) VALUES
(1, 'Interseccion Principal', 'Cruce de la Av. Principal con Calle 10', 4.6097, -74.0817, 'Av. Principal #10-20', 'Bogota', 'Colombia');

-- Semaforos de prueba
INSERT INTO semaforos (interseccion_id, nombre, tipo, estado, latitud, longitud) VALUES
(1, 'Semaforo Norte', 'vehicular', 'activo', 4.6097, -74.0817),
(1, 'Semaforo Sur', 'vehicular', 'activo', 4.6095, -74.0817),
(1, 'Semaforo Este', 'vehicular', 'activo', 4.6096, -74.0815),
(1, 'Semaforo Oeste', 'vehicular', 'activo', 4.6096, -74.0819);

-- Fases de prueba
INSERT INTO fases (semaforo_id, nombre, duracion, orden, color) VALUES
(1, 'Verde Norte', 30, 1, 'verde'),
(1, 'Amarillo Norte', 5, 2, 'amarillo'),
(1, 'Rojo Norte', 25, 3, 'rojo'),
(2, 'Verde Sur', 30, 1, 'verde'),
(2, 'Amarillo Sur', 5, 2, 'amarillo'),
(2, 'Rojo Sur', 25, 3, 'rojo');

-- Sensores de prueba
INSERT INTO sensores (interseccion_id, nombre, tipo, estado, latitud, longitud) VALUES
(1, 'Sensor Norte', 'camara', 'activo', 4.6097, -74.0817),
(1, 'Sensor Sur', 'inductivo', 'activo', 4.6095, -74.0817);

-- Camaras de prueba
INSERT INTO cameras (interseccion_id, sensor_id, name, url, camera_type) VALUES
(1, 1, 'Camara Norte', '0', 'webcam'),
(1, 2, 'Camara Sur', 'http://192.168.1.20:8080/video', 'wifi');

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================