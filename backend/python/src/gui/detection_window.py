import cv2
import time
import threading
from collections import defaultdict

from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QFrame, QGridLayout, QPushButton
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QImage, QPixmap

from ultralytics import YOLO

from src.gui.styles import GLOBAL_STYLE, COLORS
from src.gui.traffic_light import TrafficLight


class DetectionWindow(QMainWindow):
    def __init__(self, cameras_data, api_client):
        super().__init__()
        self.cameras = cameras_data
        self.api = api_client
        self.model = YOLO("yolo11n.pt")
        self.running = True
        self.frame_counters = {}
        self.camera_threads = []
        self.traffic_lights = {}
        self.grupo_lights = {}

        self.setWindowTitle("Traffic System - Deteccion en Tiempo Real")
        self.setMinimumSize(1400, 900)
        self.setStyleSheet(GLOBAL_STYLE)

        self.setup_grupo_lights()
        self.setup_ui()
        self.start_processing()

        self.traffic_timer = QTimer()
        self.traffic_timer.timeout.connect(self.update_traffic_lights)
        self.traffic_timer.start(1000)

    def setup_grupo_lights(self):
        intersecciones_grupos = {}

        for camera in self.cameras:
            grupo_id = camera[4] if len(camera) > 4 else None
            interseccion_id = camera[5] if len(camera) > 5 else None

            if grupo_id:
                if interseccion_id not in intersecciones_grupos:
                    intersecciones_grupos[interseccion_id] = set()
                intersecciones_grupos[interseccion_id].add(grupo_id)

        for interseccion_id, grupos in intersecciones_grupos.items():
            grupos_lista = sorted(list(grupos))

            for idx, grupo_id in enumerate(grupos_lista):
                if idx == 0:
                    start_offset = 0
                elif idx == 1:
                    start_offset = 22
                else:
                    start_offset = idx * 15

                if grupo_id not in self.grupo_lights:
                    self.grupo_lights[grupo_id] = TrafficLight(
                        camera_id=0,
                        interseccion_id=interseccion_id,
                        grupo_id=grupo_id,
                        start_offset=start_offset
                    )

    def setup_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)

        header = self.create_header()
        main_layout.addWidget(header)

        self.grid_widget = QWidget()
        self.grid_layout = QGridLayout(self.grid_widget)
        self.grid_layout.setSpacing(15)
        main_layout.addWidget(self.grid_widget, 1)

        self.setup_camera_grid()

    def create_header(self):
        header = QFrame()
        header.setObjectName("card")
        header.setFixedHeight(80)

        layout = QHBoxLayout(header)
        layout.setContentsMargins(20, 15, 20, 15)

        title = QLabel("Deteccion en Tiempo Real")
        title.setStyleSheet(f"color: {COLORS['accent_blue']}; font-size: 20px; font-weight: bold;")
        layout.addWidget(title)

        layout.addStretch()

        self.total_label = QLabel("Vehiculos: 0 | Personas: 0")
        self.total_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 14px; font-weight: bold;")
        layout.addWidget(self.total_label)

        stop_button = QPushButton("Detener")
        stop_button.setObjectName("danger")
        stop_button.clicked.connect(self.close)
        layout.addWidget(stop_button)

        self.update_timer = QTimer()
        self.update_timer.timeout.connect(self.update_totals)
        self.update_timer.start(1000)

        return header

    def setup_camera_grid(self):
        camera_count = len(self.cameras)
        if camera_count == 0:
            return

        columns = 2 if camera_count <= 4 else 3
        rows = (camera_count + columns - 1) // columns

        for idx, camera in enumerate(self.cameras):
            name = camera[0]
            url = camera[1]
            camera_type = camera[2]
            camera_id = camera[3]
            grupo_id = camera[4] if len(camera) > 4 else None
            interseccion_id = camera[5] if len(camera) > 5 else None

            row = idx // columns
            col = idx % columns

            container = QFrame()
            container.setObjectName("card")
            container_layout = QVBoxLayout(container)
            container_layout.setContentsMargins(10, 10, 10, 10)
            container_layout.setSpacing(8)

            grupo_text = ""
            if grupo_id:
                grupo_text = f" [Grupo {grupo_id}]"

            name_label = QLabel(f"{name}{grupo_text}")
            name_label.setAlignment(Qt.AlignCenter)
            name_label.setStyleSheet(f"color: {COLORS['accent_blue']}; font-size: 14px; font-weight: bold;")
            container_layout.addWidget(name_label)

            video_label = QLabel("Conectando...")
            video_label.setAlignment(Qt.AlignCenter)
            video_label.setStyleSheet(f"""
                background-color: {COLORS['bg_primary']};
                color: {COLORS['text_muted']};
                font-size: 14px;
                border-radius: 8px;
                padding: 40px 0;
            """)
            video_label.setMinimumHeight(220)
            container_layout.addWidget(video_label)

            counter_label = QLabel("Personas: 0 | Carros: 0 | Motos: 0")
            counter_label.setAlignment(Qt.AlignCenter)
            counter_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px; font-weight: bold;")
            container_layout.addWidget(counter_label)

            traffic_frame = QFrame()
            traffic_frame.setStyleSheet(f"""
                background-color: {COLORS['bg_primary']};
                border-radius: 8px;
                padding: 8px;
            """)
            traffic_layout = QHBoxLayout(traffic_frame)
            traffic_layout.setContentsMargins(10, 5, 10, 5)

            traffic_display = QLabel("●\n○\n○")
            traffic_display.setAlignment(Qt.AlignCenter)
            traffic_display.setStyleSheet(f"""
                font-size: 24px;
                color: {COLORS['accent_green']};
                line-height: 1.1;
                font-weight: bold;
            """)
            traffic_layout.addWidget(traffic_display)

            traffic_status = QLabel("VERDE: 25s")
            traffic_status.setAlignment(Qt.AlignCenter)
            traffic_status.setStyleSheet(f"color: {COLORS['accent_green']}; font-size: 13px; font-weight: bold;")
            traffic_layout.addWidget(traffic_status)

            traffic_layout.addStretch()

            vehicles_count = QLabel("Vehiculos: 0")
            vehicles_count.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
            traffic_layout.addWidget(vehicles_count)

            container_layout.addWidget(traffic_frame)

            self.grid_layout.addWidget(container, row, col)

            self.frame_counters[idx] = {
                'video_label': video_label,
                'counter_label': counter_label,
                'name': name,
                'url': url,
                'camera_type': camera_type,
                'camera_id': camera_id,
                'grupo_id': grupo_id,
                'interseccion_id': interseccion_id,
                'running': True,
                'counters': defaultdict(int),
                'traffic_display': traffic_display,
                'traffic_status': traffic_status,
                'vehicles_count': vehicles_count,
            }

    def start_processing(self):
        for idx, counter_data in self.frame_counters.items():
            thread = threading.Thread(target=self.process_camera, args=(idx, counter_data))
            thread.daemon = True
            thread.start()
            self.camera_threads.append(thread)

    def update_traffic_lights(self):
        grupo_counts = defaultdict(int)

        for counter_data in self.frame_counters.values():
            counters = counter_data.get('counters', {})
            vehicle_count = sum(v for k, v in counters.items() if k != 0)
            grupo_id = counter_data.get('grupo_id')

            if grupo_id:
                grupo_counts[grupo_id] += vehicle_count

        for grupo_id, traffic_light in self.grupo_lights.items():
            vehicle_count = grupo_counts.get(grupo_id, 0)
            state, remaining = traffic_light.update(vehicle_count)
            display, color = traffic_light.get_display()
            status_text = traffic_light.get_status_text()

            for counter_data in self.frame_counters.values():
                if counter_data.get('grupo_id') == grupo_id:
                    counter_data['traffic_display'].setText(display)
                    counter_data['traffic_display'].setStyleSheet(f"""
                        font-size: 24px;
                        color: {color};
                        line-height: 1.1;
                        font-weight: bold;
                    """)

                    counter_data['traffic_status'].setText(status_text)
                    counter_data['traffic_status'].setStyleSheet(f"color: {color}; font-size: 13px; font-weight: bold;")

                    counters = counter_data.get('counters', {})
                    v_count = sum(v for k, v in counters.items() if k != 0)
                    counter_data['vehicles_count'].setText(f"Vehiculos: {v_count}")

    def process_camera(self, idx, counter_data):
        url = counter_data['url']
        camera_type = counter_data['camera_type']

        try:
            if camera_type == 'webcam':
                try:
                    cap = cv2.VideoCapture(int(url))
                except:
                    cap = cv2.VideoCapture(0)
            else:
                cap = cv2.VideoCapture(url)
        except Exception as e:
            counter_data['video_label'].setText(f"Error: {str(e)[:30]}")
            return

        if not cap.isOpened():
            counter_data['video_label'].setText("Error de conexion")
            return

        counter_data['video_label'].setText("Conectado")

        detector = VehicleDetector(self.model)
        frame_count = 0
        minute_counter = defaultdict(int)
        last_save = time.time()

        while counter_data['running'] and self.running:
            ret, frame = cap.read()
            if not ret:
                counter_data['video_label'].setText("Stream perdido")
                break

            frame_count += 1
            if frame_count % 3 != 0:
                continue

            frame = cv2.resize(frame, (640, 480))
            detections, counters = detector.detect(frame)
            frame = detector.draw_detections(frame, detections)

            counter_data['counters'] = counters

            for class_id, count in counters.items():
                minute_counter[class_id] += count

            if time.time() - last_save >= 60:
                self.api.save_detection(
                    camera_id=counter_data['camera_id'],
                    counters=minute_counter,
                    interseccion_id=counter_data.get('interseccion_id')
                )
                minute_counter.clear()
                last_save = time.time()

            counter_data['counter_label'].setText(
                f"Personas: {counters.get(0, 0)} | Carros: {counters.get(2, 0)} | Motos: {counters.get(3, 0)}"
            )

            processed_frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            height, width, channel = processed_frame_rgb.shape
            bytes_per_line = 3 * width
            qt_image = QImage(processed_frame_rgb.data, width, height, bytes_per_line, QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(qt_image)
            pixmap = pixmap.scaled(640, 360, Qt.KeepAspectRatio, Qt.SmoothTransformation)
            counter_data['video_label'].setPixmap(pixmap)

        cap.release()

    def update_totals(self):
        total_personas = 0
        total_vehiculos = 0

        for counter_data in self.frame_counters.values():
            if 'counters' in counter_data:
                counters = counter_data.get('counters', {})
                total_personas += counters.get(0, 0)
                total_vehiculos += sum(v for k, v in counters.items() if k != 0)

        self.total_label.setText(f"Vehiculos: {total_vehiculos} | Personas: {total_personas}")

    def closeEvent(self, event):
        self.running = False
        for counter_data in self.frame_counters.values():
            counter_data['running'] = False
        self.update_timer.stop()
        self.traffic_timer.stop()
        for thread in self.camera_threads:
            if thread.is_alive():
                thread.join(timeout=1)
        event.accept()


class VehicleDetector:
    VEHICLE_CLASSES = {
        2: "car",
        3: "motorcycle",
        5: "bus",
        7: "truck"
    }

    PERSON_CLASS = {
        0: "person"
    }

    ALL_CLASSES = {**PERSON_CLASS, **VEHICLE_CLASSES}

    def __init__(self, model, confidence_threshold=0.5):
        self.model = model
        self.confidence_threshold = confidence_threshold
        self.tracked_objects = {}
        self.next_id = 0
        self.frame_count = 0

    def detect(self, frame):
        self.frame_count += 1
        results = self.model(frame, verbose=False, conf=self.confidence_threshold)
        detections = []
        counters = {class_id: 0 for class_id in self.ALL_CLASSES.keys()}

        current_boxes = []
        for box in results[0].boxes:
            class_id = int(box.cls[0])
            if class_id not in self.ALL_CLASSES:
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = float(box.conf[0])
            center_x = (x1 + x2) // 2
            center_y = (y1 + y2) // 2

            current_boxes.append({
                "class_id": class_id,
                "center_x": center_x,
                "center_y": center_y,
                "bbox": (x1, y1, x2, y2),
                "confidence": confidence
            })

        matched_ids = set()
        for box in current_boxes:
            matched = False
            min_dist = 100
            matched_id = None

            for obj_id, obj_data in self.tracked_objects.items():
                if obj_data["class_id"] != box["class_id"]:
                    continue

                dx = obj_data["center_x"] - box["center_x"]
                dy = obj_data["center_y"] - box["center_y"]
                dist = (dx * dx + dy * dy) ** 0.5

                if dist < min_dist:
                    min_dist = dist
                    matched_id = obj_id
                    matched = True

            if matched and min_dist < 80:
                self.tracked_objects[matched_id]["center_x"] = box["center_x"]
                self.tracked_objects[matched_id]["center_y"] = box["center_y"]
                self.tracked_objects[matched_id]["bbox"] = box["bbox"]
                self.tracked_objects[matched_id]["frame_count"] = self.frame_count
                matched_ids.add(matched_id)
            else:
                self.next_id += 1
                self.tracked_objects[self.next_id] = {
                    "class_id": box["class_id"],
                    "center_x": box["center_x"],
                    "center_y": box["center_y"],
                    "bbox": box["bbox"],
                    "confidence": box["confidence"],
                    "frame_count": self.frame_count,
                    "counted": False
                }

        to_delete = []
        for obj_id, obj_data in self.tracked_objects.items():
            if self.frame_count - obj_data["frame_count"] > 30:
                to_delete.append(obj_id)
        for obj_id in to_delete:
            del self.tracked_objects[obj_id]

        counted_ids = set()
        for obj_id, obj_data in self.tracked_objects.items():
            if self.frame_count - obj_data["frame_count"] < 10:
                class_id = obj_data["class_id"]
                if class_id not in counted_ids:
                    counters[class_id] += 1
                    counted_ids.add(class_id)

        for obj_id, obj_data in self.tracked_objects.items():
            if self.frame_count - obj_data["frame_count"] < 10:
                detections.append({
                    "class_id": obj_data["class_id"],
                    "name": self.ALL_CLASSES[obj_data["class_id"]],
                    "confidence": obj_data["confidence"],
                    "bounding_box": obj_data["bbox"],
                    "track_id": obj_id
                })

        return detections, counters

    def draw_detections(self, frame, detections):
        for detection in detections:
            x1, y1, x2, y2 = detection["bounding_box"]
            color = self._get_color_for_class(detection["class_id"])
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{detection['name']} {detection['confidence']:.2f}"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            track_label = f"ID:{detection['track_id']}"
            cv2.putText(frame, track_label, (x1, y2 + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        return frame

    @staticmethod
    def _get_color_for_class(class_id):
        if class_id == 0:
            return (255, 255, 255)
        elif class_id == 2:
            return (0, 255, 0)
        elif class_id == 3:
            return (255, 255, 0)
        elif class_id == 5:
            return (255, 0, 0)
        elif class_id == 7:
            return (0, 255, 255)
        return (0, 255, 0)