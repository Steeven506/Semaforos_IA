import cv2
import subprocess
import platform
import os

class CameraManager:
    def __init__(self):
        self.cameras = []
        self.usb_devices = []

    def detect_available_cameras(self):
        cameras = []
        
        for i in range(5):
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                cameras.append({
                    'type': 'webcam',
                    'name': f'Webcam {i}',
                    'url': str(i),
                    'status': 'disponible'
                })
                cap.release()
            else:
                cameras.append({
                    'type': 'webcam',
                    'name': f'Webcam {i}',
                    'url': str(i),
                    'status': 'no disponible'
                })

        try:
            result = subprocess.run(['adb', 'devices'], capture_output=True, text=True)
            lines = result.stdout.strip().split('\n')
            for line in lines[1:]:
                if line.strip() and 'device' in line:
                    device_id = line.split('\t')[0]
                    cameras.append({
                        'type': 'usb',
                        'name': f'USB ({device_id})',
                        'url': device_id,
                        'status': 'disponible'
                    })
        except:
            pass

        cameras.append({
            'type': 'wifi',
            'name': 'WiFi (IP Webcam)',
            'url': 'http://192.168.1.x:8080/video',
            'status': 'configurar'
        })

        cameras.append({
            'type': 'ip',
            'name': 'IP (RTSP/HTTP)',
            'url': 'rtsp://192.168.1.x:554/stream',
            'status': 'configurar'
        })

        return cameras

    def test_connection(self, camera_type, url):
        if camera_type == 'webcam':
            try:
                cap = cv2.VideoCapture(int(url))
                if cap.isOpened():
                    cap.release()
                    return True
            except:
                pass
            return False
        elif camera_type in ['wifi', 'ip', 'usb']:
            cap = cv2.VideoCapture(url)
            if cap.isOpened():
                cap.release()
                return True
            return False
        return False

    def get_camera_help(self, camera_type):
        help_text = {
            'webcam': 'Usa la camara integrada de tu PC o una camara USB conectada.\nEjemplo: 0, 1, 2...',
            'wifi': 'Usa la app IP Webcam en tu celular.\n1. Abre IP Webcam\n2. Toca "Start Server"\n3. Copia la URL que aparece',
            'usb': 'Conecta tu celular por USB y activa la depuracion USB.\nAsegurate de tener ADB instalado.',
            'ip': 'Para camaras IP profesionales.\nEjemplo: rtsp://192.168.1.100:554/stream'
        }
        return help_text.get(camera_type, '')