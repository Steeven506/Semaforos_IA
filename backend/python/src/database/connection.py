import psycopg2
from datetime import datetime

class DatabaseConnection:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'port': '5432',
            'database': 'traffic_db',
            'user': 'postgres',
            'password': 'postgres'
        }
        self.connection = None
        self.cursor = None

    def connect(self):
        try:
            self.connection = psycopg2.connect(**self.db_config)
            self.cursor = self.connection.cursor()
            self.create_tables()
            print("Conexion a PostgreSQL establecida")
            return self.connection
        except Exception as e:
            print(f"Error conectando a PostgreSQL: {e}")
            return None

    def create_tables(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS cameras (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                url VARCHAR(500) NOT NULL,
                camera_type VARCHAR(50) DEFAULT 'webcam',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS detections_log (
                id SERIAL PRIMARY KEY,
                camera_id INTEGER NOT NULL,
                timestamp TIMESTAMP NOT NULL,
                personas INTEGER DEFAULT 0,
                carros INTEGER DEFAULT 0,
                motos INTEGER DEFAULT 0,
                buses INTEGER DEFAULT 0,
                camiones INTEGER DEFAULT 0,
                total INTEGER DEFAULT 0,
                FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
            )
        ''')
        self.cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_detections_camera_id 
            ON detections_log(camera_id)
        ''')
        self.cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_detections_timestamp 
            ON detections_log(timestamp)
        ''')
        self.connection.commit()

    def get_or_create_camera(self, name, url, camera_type):
        self.cursor.execute('SELECT id FROM cameras WHERE name = %s AND url = %s', (name, url))
        result = self.cursor.fetchone()
        if result:
            return result[0]
        
        self.cursor.execute(
            'INSERT INTO cameras (name, url, camera_type) VALUES (%s, %s, %s) RETURNING id',
            (name, url, camera_type)
        )
        camera_id = self.cursor.fetchone()[0]
        self.connection.commit()
        print(f"Camara creada con ID: {camera_id}")
        return camera_id

    def save_cameras(self, cameras):
        self.cursor.execute('DELETE FROM cameras')
        for name, url, camera_type in cameras:
            self.cursor.execute(
                'INSERT INTO cameras (name, url, camera_type) VALUES (%s, %s, %s)',
                (name, url, camera_type)
            )
        self.connection.commit()

    def load_cameras(self):
        self.cursor.execute('SELECT name, url, camera_type FROM cameras ORDER BY id')
        return self.cursor.fetchall()

    def save_detection_log(self, camera_id, counters):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        total = sum(counters.values())
        self.cursor.execute('''
            INSERT INTO detections_log
            (camera_id, timestamp, personas, carros, motos, buses, camiones, total)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            camera_id,
            timestamp,
            counters.get(0, 0),
            counters.get(2, 0),
            counters.get(3, 0),
            counters.get(5, 0),
            counters.get(7, 0),
            total
        ))
        self.connection.commit()
        return total

    def close(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()