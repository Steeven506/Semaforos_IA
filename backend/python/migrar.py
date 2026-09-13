import sqlite3
import psycopg2
import os

sqlite_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "database", "traffic.db")

print("Conectando a SQLite...")
sqlite_conn = sqlite3.connect(sqlite_path)
sqlite_cursor = sqlite_conn.cursor()

print("Conectando a PostgreSQL...")
try:
    pg_conn = psycopg2.connect(
        host='localhost',
        port='5432',
        database='traffic_db',
        user='postgres',
        password='postgres'
    )
    pg_cursor = pg_conn.cursor()
    print("Conexion a PostgreSQL exitosa")
except Exception as e:
    print(f"Error: {e}")
    print("Verifica que PostgreSQL este corriendo y la contraseña sea correcta")
    exit()

print("Migrando cameras...")
try:
    sqlite_cursor.execute('SELECT id, name, url, camera_type FROM cameras')
    cameras = sqlite_cursor.fetchall()
    print(f"Encontradas {len(cameras)} camaras")
except:
    sqlite_cursor.execute('SELECT id, name, url, "" as camera_type FROM cameras')
    cameras = sqlite_cursor.fetchall()
    print(f"Encontradas {len(cameras)} camaras (sin tipo)")

for camera in cameras:
    try:
        pg_cursor.execute('''
            INSERT INTO cameras (id, name, url, camera_type)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                url = EXCLUDED.url,
                camera_type = EXCLUDED.camera_type
        ''', (camera[0], camera[1], camera[2], camera[3] if len(camera) > 3 else 'webcam'))
    except Exception as e:
        print(f"Error migrando camera {camera[0]}: {e}")

print("Migrando detections_log...")
sqlite_cursor.execute('SELECT camera_id, timestamp, personas, carros, motos, buses, camiones, total FROM detections_log')
detections = sqlite_cursor.fetchall()
print(f"Encontradas {len(detections)} detecciones")

for det in detections:
    try:
        pg_cursor.execute('''
            INSERT INTO detections_log (camera_id, timestamp, personas, carros, motos, buses, camiones, total)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (det[0], det[1], det[2], det[3], det[4], det[5], det[6], det[7]))
    except Exception as e:
        print(f"Error migrando deteccion: {e}")

pg_conn.commit()
sqlite_conn.close()
pg_conn.close()

print("Migracion completada exitosamente!")