import os
from dotenv import load_dotenv
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from src.database.connection import connect_postgres, decode_pg_error

load_dotenv()

print("=== CREACION DE BASE DE DATOS POSTGRESQL ===\n")

password = os.getenv("DB_PASSWORD", "postgres") or "postgres"
print("Usando DB_PASSWORD de .env (no se muestra en pantalla).")

try:
    conn = connect_postgres(database="postgres", password=password)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'traffic_db'")
    if not cursor.fetchone():
        cursor.execute("CREATE DATABASE traffic_db")
        print("\n Base de datos 'traffic_db' creada exitosamente")
    else:
        print("\n La base de datos 'traffic_db' ya existe")

    cursor.close()
    conn.close()

    app_conn = connect_postgres(database="traffic_db", password=password)
    app_conn.close()
    print(" Conexion a PostgreSQL exitosa")

except Exception as e:
    msg = decode_pg_error(e) if isinstance(e, UnicodeDecodeError) else e
    print(f"\n Error: {msg}")
    print("\n Posibles soluciones:")
    print(" 1. PostgreSQL no esta corriendo")
    print(" 2. Contraseña incorrecta (revisa DB_PASSWORD en .env)")
    print(" 3. Puerto incorrecto (default: 5432)")
    print("\n Para verificar si PostgreSQL esta corriendo:")
    print("   Get-Service -Name 'postgresql*'")
