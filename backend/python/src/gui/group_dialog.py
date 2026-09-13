from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
    QPushButton, QComboBox, QMessageBox
)
from PySide6.QtCore import Qt

from src.gui.styles import GLOBAL_STYLE, COLORS


class GroupDialog(QDialog):
    def __init__(self, parent=None, grupo=None, intersections=None):
        super().__init__(parent)
        self.grupo = grupo
        self.intersections = intersections or []
        self.result_data = None

        self.setWindowTitle("Editar Grupo" if grupo else "Nuevo Grupo")
        self.setFixedSize(500, 450)
        self.setStyleSheet(GLOBAL_STYLE)
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(30, 30, 30, 30)
        layout.setSpacing(15)

        title = QLabel("Editar Grupo" if self.grupo else "Nuevo Grupo")
        title.setObjectName("title")
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)

        intersection_label = QLabel("Interseccion")
        intersection_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(intersection_label)

        self.intersection_combo = QComboBox()
        for i in self.intersections:
            self.intersection_combo.addItem(i.get("nombre"), i.get("id"))

        if self.grupo and self.grupo.get("interseccion_id"):
            index = self.intersection_combo.findData(self.grupo.get("interseccion_id"))
            if index >= 0:
                self.intersection_combo.setCurrentIndex(index)

        if self.grupo:
            self.intersection_combo.setEnabled(False)

        layout.addWidget(self.intersection_combo)

        name_label = QLabel("Nombre del Grupo")
        name_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(name_label)

        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("Grupo Avenida")
        if self.grupo:
            self.name_input.setText(self.grupo.get("nombre", ""))
        layout.addWidget(self.name_input)

        description_label = QLabel("Descripcion")
        description_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(description_label)

        self.description_input = QLineEdit()
        self.description_input.setPlaceholderText("Semaforos de la Av. Principal")
        if self.grupo:
            self.description_input.setText(self.grupo.get("descripcion", ""))
        layout.addWidget(self.description_input)

        direction_label = QLabel("Direccion")
        direction_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(direction_label)

        self.direction_combo = QComboBox()
        self.direction_combo.addItem("Norte-Sur", "Norte-Sur")
        self.direction_combo.addItem("Sur-Norte", "Sur-Norte")
        self.direction_combo.addItem("Este-Oeste", "Este-Oeste")
        self.direction_combo.addItem("Oeste-Este", "Oeste-Este")

        if self.grupo and self.grupo.get("direccion"):
            index = self.direction_combo.findData(self.grupo.get("direccion"))
            if index >= 0:
                self.direction_combo.setCurrentIndex(index)

        layout.addWidget(self.direction_combo)

        color_label = QLabel("Color del Grupo")
        color_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(color_label)

        self.color_combo = QComboBox()
        self.color_combo.addItem("Azul", "azul")
        self.color_combo.addItem("Naranja", "naranja")
        self.color_combo.addItem("Verde", "verde")
        self.color_combo.addItem("Rojo", "rojo")
        self.color_combo.addItem("Purpura", "purpura")

        if self.grupo and self.grupo.get("color_grupo"):
            index = self.color_combo.findData(self.grupo.get("color_grupo"))
            if index >= 0:
                self.color_combo.setCurrentIndex(index)

        layout.addWidget(self.color_combo)

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

    def handle_save(self):
        nombre = self.name_input.text().strip()
        descripcion = self.description_input.text().strip()
        direccion = self.direction_combo.currentData()
        color_grupo = self.color_combo.currentData()
        interseccion_id = self.intersection_combo.currentData()

        if not nombre:
            QMessageBox.warning(self, "Error", "El nombre es requerido")
            return

        if not interseccion_id:
            QMessageBox.warning(self, "Error", "Selecciona una interseccion")
            return

        self.result_data = {
            "interseccion_id": interseccion_id,
            "nombre": nombre,
            "descripcion": descripcion,
            "direccion": direccion,
            "color_grupo": color_grupo
        }

        self.accept()