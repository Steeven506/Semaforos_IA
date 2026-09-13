import sqlite3
import csv
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "database", "traffic.db")

def exportar_csv():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    hoy = datetime.now().strftime('%Y-%m-%d')
    
    cursor.execute('''
        SELECT timestamp, personas, carros, motos, buses, camiones, total
        FROM detections_log
        WHERE timestamp LIKE ?
        ORDER BY timestamp
    ''', (f'{hoy}%',))
    
    datos = cursor.fetchall()
    conn.close()
    
    if datos:
        nombre = f'reporte_{hoy}.csv'
        with open(nombre, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Timestamp', 'Personas', 'Carros', 'Motos', 'Buses', 'Camiones', 'Total'])
            writer.writerows(datos)
        print(f'Reporte exportado: {nombre}')
        print(f'Total registros: {len(datos)}')
    else:
        print('No hay datos para exportar hoy')

def exportar_semanal():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT DATE(timestamp) as fecha, 
               SUM(personas) as personas,
               SUM(carros) as carros,
               SUM(motos) as motos,
               SUM(buses) as buses,
               SUM(camiones) as camiones,
               SUM(total) as total
        FROM detections_log
        WHERE DATE(timestamp) >= DATE('now', '-7 days')
        GROUP BY DATE(timestamp)
        ORDER BY fecha
    ''')
    
    datos = cursor.fetchall()
    conn.close()
    
    if datos:
        nombre = f'reporte_semanal.csv'
        with open(nombre, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Fecha', 'Personas', 'Carros', 'Motos', 'Buses', 'Camiones', 'Total'])
            writer.writerows(datos)
        print(f'Reporte semanal exportado: {nombre}')
    else:
        print('No hay datos para exportar')

def exportar_mensual():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT DATE(timestamp) as fecha, 
               SUM(personas) as personas,
               SUM(carros) as carros,
               SUM(motos) as motos,
               SUM(buses) as buses,
               SUM(camiones) as camiones,
               SUM(total) as total
        FROM detections_log
        WHERE DATE(timestamp) >= DATE('now', '-30 days')
        GROUP BY DATE(timestamp)
        ORDER BY fecha
    ''')
    
    datos = cursor.fetchall()
    conn.close()
    
    if datos:
        nombre = f'reporte_mensual.csv'
        with open(nombre, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Fecha', 'Personas', 'Carros', 'Motos', 'Buses', 'Camiones', 'Total'])
            writer.writerows(datos)
        print(f'Reporte mensual exportado: {nombre}')
    else:
        print('No hay datos para exportar')

if __name__ == '__main__':
    print("=== EXPORTAR REPORTES ===")
    print("1. Exportar reporte diario")
    print("2. Exportar reporte semanal")
    print("3. Exportar reporte mensual")
    
    opcion = input("Selecciona una opcion (1-3): ")
    
    if opcion == '1':
        exportar_csv()
    elif opcion == '2':
        exportar_semanal()
    elif opcion == '3':
        exportar_mensual()
    else:
        print("Opcion invalida")