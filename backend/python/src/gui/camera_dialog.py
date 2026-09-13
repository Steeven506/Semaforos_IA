from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QComboBox, QMessageBox
)
from PySide6.QtCore import Qt

from src.gui.styles import GLOBAL_STYLE, COLORS


class CameraDialog(QDialog):
    def __init__(self, parent=None, camera=None, intersections=None, grupos=None):
        super().__init__(parent)
        self.camera = camera
        self.intersections = intersections or []
        self.grupos = grupos or []
        self.result_data = None

        self.setWindowTitle("Editar Camara" if camera else "Nueva Camara")
        self.setFixedSize(550, 650)
        self.setStyleSheet(GLOBAL_STYLE)
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(15)

        title = QLabel("Editar Camara" if self.camera else "Nueva Camara")
        title.setObjectName("title")
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)

        name_label = QLabel("Nombre de la Camara")
        name_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(name_label)

        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("Camara Parque Principal")
        if self.camera:
            self.name_input.setText(self.camera.get("name", ""))
        layout.addWidget(self.name_input)

        type_label = QLabel("Tipo de Camara")
        type_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(type_label)

        self.type_combo = QComboBox()
        self.type_combo.addItem("Webcam (PC)", "webcam")
        self.type_combo.addItem("WiFi (IP Webcam)", "wifi")
        self.type_combo.addItem("USB (Celular)", "usb")
        self.type_combo.addItem("IP (RTSP/HTTP)", "ip")
        if self.camera:
            index = self.type_combo.findData(self.camera.get("camera_type"))
            if index >= 0:
                self.type_combo.setCurrentIndex(index)
        self.type_combo.currentIndexChanged.connect(self.update_placeholder)
        layout.addWidget(self.type_combo)

        url_label = QLabel("URL o ID de la Camara")
        url_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(url_label)

        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("0")
        if self.camera:
            self.url_input.setText(self.camera.get("url", ""))
        layout.addWidget(self.url_input)

        self.url_hint = QLabel("Ejemplo: 0 (webcam integrada)")
        self.url_hint.setStyleSheet(f"color: {COLORS['text_muted']}; font-size: 11px;")
        layout.addWidget(self.url_hint)

        if self.intersections:
            intersection_label = QLabel("Interseccion")
            intersection_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
            layout.addWidget(intersection_label)

            self.intersection_combo = QComboBox()
            self.intersection_combo.addItem("Sin interseccion", None)
            for i in self.intersections:
                self.intersection_combo.addItem(i.get("nombre"), i.get("id"))

            if self.camera and self.camera.get("interseccion_id"):
                index = self.intersection_combo.findData(self.camera.get("interseccion_id"))
                if index >= 0:
                    self.intersection_combo.setCurrentIndex(index)

            self.intersection_combo.currentIndexChanged.connect(self.update_grupos)
            layout.addWidget(self.intersection_combo)
        else:
            self.intersection_combo = None

        grupo_label = QLabel("Grupo de Semaforos")
        grupo_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(grupo_label)

        self.grupo_combo = QComboBox()
        self.populate_grupos()

        if self.camera and self.camera.get("grupo_id"):
            index = self.grupo_combo.findData(self.camera.get("grupo_id"))
            if index >= 0:
                self.grupo_combo.setCurrentIndex(index)

        layout.addWidget(self.grupo_combo)

        grupo_hint = QLabel("Los semaforos del mismo grupo tendran el mismo color")
        grupo_hint.setStyleSheet(f"color: {COLORS['text_muted']}; font-size: 11px;")
        layout.addWidget(grupo_hint)

        layout.addStretch()

        button_layout = QHBoxLayout()
        button_layout.setSpacing(10)

        cancel_button = QPushButton("Cancelar")
        cancel_button.setObjectName("ghost")
        cancel_button.clicked.connect(self.reject)
        button_layout.addWidget(cancel_button)

        save_button = QPushButton("Guardar")
        save_button.setObjectName("success")
        save_button.clicked.connect(self.handle_save)
        button_layout.addWidget(save_button)

        layout.addLayout(button_layout)

        self.update_placeholder()

    def populate_grupos(self):
        self.grupo_combo.clear()
        self.grupo_combo.addItem("Sin grupo", None)

        for grupo in self.grupos:
            self.grupo_combo.addItem(grupo.get("nombre"), grupo.get("id"))

    def update_grupos(self):
        if not self.intersection_combo:
            return

        interseccion_id = self.intersection_combo.currentData()

        if interseccion_id is None:
            self.populate_grupos()
            return

        grupos_filtrados = [
            g for g in self.grupos
            if g.get("interseccion_id") == interseccion_id
        ]

        self.grupo_combo.clear()
        self.grupo_combo.addItem("Sin grupo", None)

        for grupo in grupos_filtrados:
            self.grupo_combo.addItem(grupo.get("nombre"), grupo.get("id"))

    def update_placeholder(self):
        camera_type = self.type_combo.currentData()
        placeholders = {
            "webcam": ("0", "Ejemplo: 0 (webcam integrada), 1 (USB externa)"),
            "wifi": ("http://192.168.1.20:8080/video", "IP de IP Webcam en el celular"),
            "usb": ("http://127.0.0.1:8080/video", "Celular conectado por USB con ADB"),
            "ip": ("rtsp://192.168.1.100:554/stream", "URL RTSP de camara IP")
        }
        placeholder, hint = placeholders.get(camera_type, ("", ""))
        self.url_input.setPlaceholderText(placeholder)
        self.url_hint.setText(hint)

    def handle_save(self):
        name = self.name_input.text().strip()
        url = self.url_input.text().strip()
        camera_type = self.type_combo.currentData()
        interseccion_id = self.intersection_combo.currentData() if self.intersection_combo else None
        grupo_id = self.grupo_combo.currentData()

        if not name:
            QMessageBox.warning(self, "Error", "El nombre es requerido")
            return

        if not url:
            QMessageBox.warning(self, "Error", "La URL o ID es requerido")
            return

        self.result_data = {
            "name": name,
            "url": url,
            "camera_type": camera_type,
            "interseccion_id": interseccion_id,
            "grupo_id": grupo_id
        }

        self.accept()