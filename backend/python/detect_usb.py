import subprocess
import cv2
import platform

def detect_usb_webcams():
    cameras = []
    
    for i in range(10):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            cameras.append({
                'index': i,
                'type': 'webcam',
                'status': 'disponible'
            })
            cap.release()
    
    return cameras

def detect_adb_devices():
    try:
        result = subprocess.run(['adb', 'devices'], capture_output=True, text=True)
        lines = result.stdout.strip().split('\n')
        devices = []
        for line in lines[1:]:
            if line.strip() and 'device' in line:
                device_id = line.split('\t')[0]
                devices.append({
                    'id': device_id,
                    'type': 'usb',
                    'status': 'conectado'
                })
        return devices
    except:
        return []

def detect_ip_cameras():
    print("Para detectar camaras IP, asegurate de:")
    print("  - Estar en la misma red")
    print("  - Conocer la IP y puerto")
    print("  - Ejemplo: rtsp://192.168.1.100:554/stream")
    return []

if __name__ == "__main__":
    print("=== DETECTANDO CAMARAS DISPONIBLES ===\n")
    
    print("Webcams USB/PC:")
    webcams = detect_usb_webcams()
    if webcams:
        for cam in webcams:
            print(f"  - Webcam {cam['index']}: {cam['status']}")
    else:
        print("  - No se detectaron webcams")
    
    print("\nDispositivos USB (ADB):")
    adb_devices = detect_adb_devices()
    if adb_devices:
        for device in adb_devices:
            print(f"  - {device['id']}: {device['status']}")
    else:
        print("  - No se detectaron dispositivos ADB")
    
    print("\nRecomendaciones:")
    print("  - Webcam: Usar indice 0, 1, 2...")
    print("  - USB: Configurar ADB y usar 'http://127.0.0.1:8080/video'")
    print("  - WiFi: Usar IP de la app IP Webcam")
    print("  - IP: Usar URL RTSP o HTTP")