from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QPushButton, QFrame, QScrollArea, QMessageBox, QTableWidget,
    QTableWidgetItem, QHeaderView, QAbstractItemView, QTabWidget
)
from PySide6.QtCore import Qt, QTimer
from PySide6.QtGui import QFont

from src.gui.styles import GLOBAL_STYLE, COLORS
from src.gui.camera_dialog import CameraDialog
from src.gui.group_dialog import GroupDialog


class MainWindow(QMainWindow):
    def __init__(self, api_client):
        super().__init__()
        self.api = api_client
        self.cameras = []
        self.intersections = []
        self.grupos = []
        self.detection_windows = []

        self.setWindowTitle("Traffic System - Dashboard")
        self.setMinimumSize(1200, 800)
        self.setStyleSheet(GLOBAL_STYLE)

        self.setup_ui()
        self.load_data()

    def setup_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)

        header = self.create_header()
        main_layout.addWidget(header)

        content = QHBoxLayout()
        content.setSpacing(15)

        left_panel = self.create_left_panel()
        content.addWidget(left_panel, 2)

        right_panel = self.create_right_panel()
        content.addWidget(right_panel, 1)

        main_layout.addLayout(content)

    def create_header(self):
        header = QFrame()
        header.setObjectName("card")
        header.setFixedHeight(90)

        layout = QHBoxLayout(header)
        layout.setContentsMargins(20, 15, 20, 15)

        left = QVBoxLayout()
        title = QLabel("Traffic System")
        title.setStyleSheet(f"color: {COLORS['accent_blue']}; font-size: 22px; font-weight: bold;")
        left.addWidget(title)

        subtitle = QLabel(f"Conectado como: {self.api.user.get('nombre', 'Usuario')} ({self.api.user.get('email', '')})")
        subtitle.setStyleSheet(f"color: {COLORS['text_muted']}; font-size: 12px;")
        left.addWidget(subtitle)

        layout.addLayout(left)
        layout.addStretch()

        role_label = QLabel(self.get_role_name())
        role_label.setStyleSheet(f"""
            background-color: {COLORS['accent_purple']};
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        """)
        layout.addWidget(role_label)

        return header

    def get_role_name(self):
        role_id = self.api.user.get("role_id")
        if role_id == 1:
            return "ADMINISTRADOR"
        elif role_id == 2:
            return "OPERADOR"
        return "VISUALIZADOR"

    def create_left_panel(self):
        panel = QFrame()
        panel.setObjectName("card")
        layout = QVBoxLayout(panel)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        self.tabs = QTabWidget()
        self.tabs.setStyleSheet(f"""
            QTabWidget::pane {{
                border: none;
                background: transparent;
            }}
            QTabBar::tab {{
                background-color: {COLORS['bg_tertiary']};
                color: {COLORS['text_secondary']};
                padding: 10px 20px;
                border-radius: 8px;
                margin-right: 5px;
                font-weight: bold;
            }}
            QTabBar::tab:selected {{
                background-color: {COLORS['accent_blue']};
                color: white;
            }}
        """)

        cameras_tab = self.create_cameras_tab()
        self.tabs.addTab(cameras_tab, "Camaras")

        grupos_tab = self.create_grupos_tab()
        self.tabs.addTab(grupos_tab, "Grupos")

        layout.addWidget(self.tabs)

        buttons_layout = QHBoxLayout()
        buttons_layout.setSpacing(10)

        self.start_all_button = QPushButton("Iniciar Deteccion")
        self.start_all_button.setObjectName("success")
        self.start_all_button.setMinimumHeight(45)
        self.start_all_button.clicked.connect(self.start_detection)
        buttons_layout.addWidget(self.start_all_button)

        layout.addLayout(buttons_layout)

        return panel

    def create_cameras_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        layout.setContentsMargins(0, 10, 0, 0)
        layout.setSpacing(15)

        top = QHBoxLayout()
        title = QLabel("Camaras Configuradas")
        title.setObjectName("section")
        top.addWidget(title)
        top.addStretch()

        add_button = QPushButton("+ Nueva Camara")
        add_button.setObjectName("success")
        add_button.clicked.connect(self.add_camera)
        top.addWidget(add_button)

        layout.addLayout(top)

        self.camera_table = QTableWidget()
        self.camera_table.setColumnCount(6)
        self.camera_table.setHorizontalHeaderLabels(["ID", "Nombre", "Tipo", "URL", "Grupo", "Estado"])
        self.camera_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.camera_table.horizontalHeader().setSectionResizeMode(3, QHeaderView.Stretch)
        self.camera_table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.camera_table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.camera_table.verticalHeader().setVisible(False)
        layout.addWidget(self.camera_table)

        buttons_layout = QHBoxLayout()
        buttons_layout.setSpacing(10)

        self.edit_button = QPushButton("Editar")
        self.edit_button.setObjectName("warning")
        self.edit_button.clicked.connect(self.edit_camera)
        buttons_layout.addWidget(self.edit_button)

        self.delete_button = QPushButton("Eliminar")
        self.delete_button.setObjectName("danger")
        self.delete_button.clicked.connect(self.delete_camera)
        buttons_layout.addWidget(self.delete_button)

        buttons_layout.addStretch()

        layout.addLayout(buttons_layout)

        return tab

    def create_grupos_tab(self):
        tab = QWidget()
        layout = QVBoxLayout(tab)
        layout.setContentsMargins(0, 10, 0, 0)
        layout.setSpacing(15)

        top = QHBoxLayout()
        title = QLabel("Grupos de Semaforos")
        title.setObjectName("section")
        top.addWidget(title)
        top.addStretch()

        add_button = QPushButton("+ Nuevo Grupo")
        add_button.setObjectName("success")
        add_button.clicked.connect(self.add_grupo)
        top.addWidget(add_button)

        layout.addLayout(top)

        self.grupo_table = QTableWidget()
        self.grupo_table.setColumnCount(6)
        self.grupo_table.setHorizontalHeaderLabels(["ID", "Nombre", "Interseccion", "Direccion", "Color", "Semaforos"])
        self.grupo_table.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.grupo_table.horizontalHeader().setSectionResizeMode(2, QHeaderView.Stretch)
        self.grupo_table.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.grupo_table.setEditTriggers(QAbstractItemView.NoEditTriggers)
        self.grupo_table.verticalHeader().setVisible(False)
        layout.addWidget(self.grupo_table)

        buttons_layout = QHBoxLayout()
        buttons_layout.setSpacing(10)

        self.edit_grupo_button = QPushButton("Editar")
        self.edit_grupo_button.setObjectName("warning")
        self.edit_grupo_button.clicked.connect(self.edit_grupo)
        buttons_layout.addWidget(self.edit_grupo_button)

        self.delete_grupo_button = QPushButton("Eliminar")
        self.delete_grupo_button.setObjectName("danger")
        self.delete_grupo_button.clicked.connect(self.delete_grupo)
        buttons_layout.addWidget(self.delete_grupo_button)

        buttons_layout.addStretch()

        layout.addLayout(buttons_layout)

        return tab

    def create_right_panel(self):
        panel = QFrame()
        panel.setObjectName("card")
        layout = QVBoxLayout(panel)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        title = QLabel("Semaforo Simulado")
        title.setObjectName("section")
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)

        self.traffic_light_frame = QFrame()
        self.traffic_light_frame.setObjectName("cardHighlight")
        self.traffic_light_frame.setMinimumHeight(180)
        tl_layout = QVBoxLayout(self.traffic_light_frame)

        self.traffic_light_display = QLabel("●\n●\n●")
        self.traffic_light_display.setAlignment(Qt.AlignCenter)
        self.traffic_light_display.setStyleSheet(f"""
            font-size: 40px;
            color: {COLORS['text_muted']};
            line-height: 1.2;
        """)
        tl_layout.addWidget(self.traffic_light_display)

        self.traffic_status = QLabel("VERDE: 30s")
        self.traffic_status.setAlignment(Qt.AlignCenter)
        self.traffic_status.setStyleSheet(f"color: {COLORS['accent_green']}; font-size: 16px; font-weight: bold;")
        tl_layout.addWidget(self.traffic_status)

        layout.addWidget(self.traffic_light_frame)

        stats_title = QLabel("Estadisticas del Dia")
        stats_title.setObjectName("section")
        layout.addWidget(stats_title)

        self.stats_frame = QFrame()
        self.stats_frame.setObjectName("card")
        stats_layout = QVBoxLayout(self.stats_frame)
        stats_layout.setSpacing(8)

        self.stat_vehiculos = self.create_stat_row("Vehiculos Totales", "0", COLORS['accent_blue'])
        stats_layout.addWidget(self.stat_vehiculos)

        self.stat_personas = self.create_stat_row("Personas Detectadas", "0", COLORS['accent_green'])
        stats_layout.addWidget(self.stat_personas)

        self.stat_carros = self.create_stat_row("Carros", "0", COLORS['accent_cyan'])
        stats_layout.addWidget(self.stat_carros)

        self.stat_motos = self.create_stat_row("Motos", "0", COLORS['accent_yellow'])
        stats_layout.addWidget(self.stat_motos)

        layout.addWidget(self.stats_frame)

        layout.addStretch()

        refresh_button = QPushButton("Actualizar")
        refresh_button.setObjectName("ghost")
        refresh_button.clicked.connect(self.refresh_data)
        layout.addWidget(refresh_button)

        self.traffic_timer = QTimer()
        self.traffic_timer.timeout.connect(self.update_traffic_light)
        self.traffic_timer.start(1000)

        self.stats_timer = QTimer()
        self.stats_timer.timeout.connect(self.refresh_stats)
        self.stats_timer.start(30000)

        return panel

    def create_stat_row(self, label, value, color):
        frame = QFrame()
        layout = QHBoxLayout(frame)
        layout.setContentsMargins(10, 8, 10, 8)

        label_widget = QLabel(label)
        label_widget.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        layout.addWidget(label_widget)

        layout.addStretch()

        value_widget = QLabel(value)
        value_widget.setObjectName(f"stat_{label.replace(' ', '_')}")
        value_widget.setStyleSheet(f"color: {color}; font-size: 18px; font-weight: bold;")
        layout.addWidget(value_widget)

        return frame

    def update_traffic_light(self):
        import time
        current_time = int(time.time())
        cycle_time = current_time % 45

        if cycle_time < 25:
            self.traffic_light_display.setStyleSheet(f"""
                font-size: 40px;
                color: {COLORS['accent_green']};
                line-height: 1.2;
            """)
            self.traffic_light_display.setText("●\n○\n○")
            self.traffic_status.setText(f"VERDE: {25 - cycle_time}s")
            self.traffic_status.setStyleSheet(f"color: {COLORS['accent_green']}; font-size: 16px; font-weight: bold;")
        elif cycle_time < 30:
            self.traffic_light_display.setStyleSheet(f"""
                font-size: 40px;
                color: {COLORS['accent_yellow']};
                line-height: 1.2;
            """)
            self.traffic_light_display.setText("○\n●\n○")
            self.traffic_status.setText(f"AMARILLO: {30 - cycle_time}s")
            self.traffic_status.setStyleSheet(f"color: {COLORS['accent_yellow']}; font-size: 16px; font-weight: bold;")
        else:
            self.traffic_light_display.setStyleSheet(f"""
                font-size: 40px;
                color: {COLORS['accent_red']};
                line-height: 1.2;
            """)
            self.traffic_light_display.setText("○\n○\n●")
            self.traffic_status.setText(f"ROJO: {45 - cycle_time}s")
            self.traffic_status.setStyleSheet(f"color: {COLORS['accent_red']}; font-size: 16px; font-weight: bold;")

    def load_data(self):
        self.refresh_data()

    def refresh_data(self):
        self.cameras = self.api.get_cameras()
        self.intersections = self.api.get_intersections()
        self.grupos = self.api.get_grupos()
        self.update_camera_table()
        self.update_grupo_table()
        self.refresh_stats()

    def refresh_stats(self):
        try:
            stats = self.api.get_today_stats()
            if stats:
                self.set_stat_value("Vehiculos_Totales", stats.get("total_vehiculos", 0))
                self.set_stat_value("Personas_Detectadas", stats.get("total_personas", 0))
                self.set_stat_value("Carros", stats.get("total_carros", 0))
                self.set_stat_value("Motos", stats.get("total_motos", 0))
        except Exception as e:
            print(f"Error actualizando stats: {e}")

    def set_stat_value(self, label, value):
        widgets = self.findChildren(QLabel, f"stat_{label}")
        if widgets:
            widgets[0].setText(str(value))

    def update_camera_table(self):
        self.camera_table.setRowCount(0)

        for camera in self.cameras:
            row = self.camera_table.rowCount()
            self.camera_table.insertRow(row)

            self.camera_table.setItem(row, 0, QTableWidgetItem(str(camera.get("id", ""))))
            self.camera_table.setItem(row, 1, QTableWidgetItem(camera.get("name", "")))
            self.camera_table.setItem(row, 2, QTableWidgetItem(camera.get("camera_type", "").upper()))
            self.camera_table.setItem(row, 3, QTableWidgetItem(camera.get("url", "")))

            grupo_nombre = "Sin grupo"
            if camera.get("grupo_id"):
                for grupo in self.grupos:
                    if grupo.get("id") == camera.get("grupo_id"):
                        grupo_nombre = grupo.get("nombre")
                        break

            self.camera_table.setItem(row, 4, QTableWidgetItem(grupo_nombre))

            status = "Activa" if camera.get("activo", True) else "Inactiva"
            status_item = QTableWidgetItem(status)
            if camera.get("activo", True):
                status_item.setForeground(Qt.green)
            else:
                status_item.setForeground(Qt.red)
            self.camera_table.setItem(row, 5, status_item)

    def update_grupo_table(self):
        self.grupo_table.setRowCount(0)

        for grupo in self.grupos:
            row = self.grupo_table.rowCount()
            self.grupo_table.insertRow(row)

            self.grupo_table.setItem(row, 0, QTableWidgetItem(str(grupo.get("id", ""))))
            self.grupo_table.setItem(row, 1, QTableWidgetItem(grupo.get("nombre", "")))
            self.grupo_table.setItem(row, 2, QTableWidgetItem(grupo.get("interseccion_nombre", "")))
            self.grupo_table.setItem(row, 3, QTableWidgetItem(grupo.get("direccion", "")))
            self.grupo_table.setItem(row, 4, QTableWidgetItem(grupo.get("color_grupo", "")))
            self.grupo_table.setItem(row, 5, QTableWidgetItem(str(grupo.get("total_semaforos", 0))))

    def get_selected_camera(self):
        selected = self.camera_table.selectedItems()
        if not selected:
            return None

        row = selected[0].row()
        if row < len(self.cameras):
            return self.cameras[row]
        return None

    def get_selected_grupo(self):
        selected = self.grupo_table.selectedItems()
        if not selected:
            return None

        row = selected[0].row()
        if row < len(self.grupos):
            return self.grupos[row]
        return None

    def add_camera(self):
        dialog = CameraDialog(self, None, self.intersections, self.grupos)
        if dialog.exec():
            data = dialog.result_data
            result = self.api.create_camera(
                name=data["name"],
                url=data["url"],
                camera_type=data["camera_type"],
                interseccion_id=data["interseccion_id"]
            )
            if result:
                if data.get("grupo_id"):
                    self.api.update_camera(
                        camera_id=result["id"],
                        name=data["name"],
                        url=data["url"],
                        camera_type=data["camera_type"],
                        interseccion_id=data["interseccion_id"],
                        grupo_id=data["grupo_id"]
                    )
                QMessageBox.information(self, "Exito", "Camara agregada correctamente")
                self.refresh_data()
            else:
                QMessageBox.warning(self, "Error", "No se pudo agregar la camara")

    def edit_camera(self):
        camera = self.get_selected_camera()
        if not camera:
            QMessageBox.warning(self, "Error", "Selecciona una camara para editar")
            return

        dialog = CameraDialog(self, camera, self.intersections, self.grupos)
        if dialog.exec():
            data = dialog.result_data
            result = self.api.update_camera(
                camera_id=camera["id"],
                name=data["name"],
                url=data["url"],
                camera_type=data["camera_type"],
                interseccion_id=data["interseccion_id"],
                grupo_id=data["grupo_id"]
            )
            if result:
                QMessageBox.information(self, "Exito", "Camara actualizada correctamente")
                self.refresh_data()
            else:
                QMessageBox.warning(self, "Error", "No se pudo actualizar la camara")

    def delete_camera(self):
        camera = self.get_selected_camera()
        if not camera:
            QMessageBox.warning(self, "Error", "Selecciona una camara para eliminar")
            return

        reply = QMessageBox.question(
            self, "Confirmar",
            f"Eliminar la camara '{camera['name']}'?",
            QMessageBox.Yes | QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            if self.api.delete_camera(camera["id"]):
                QMessageBox.information(self, "Exito", "Camara eliminada correctamente")
                self.refresh_data()
            else:
                QMessageBox.warning(self, "Error", "No se pudo eliminar la camara")

    def add_grupo(self):
        if not self.intersections:
            QMessageBox.warning(self, "Error", "Primero crea una interseccion")
            return

        dialog = GroupDialog(self, None, self.intersections)
        if dialog.exec():
            data = dialog.result_data
            result = self.api.create_grupo(
                interseccion_id=data["interseccion_id"],
                nombre=data["nombre"],
                descripcion=data["descripcion"],
                color_grupo=data["color_grupo"],
                direccion=data["direccion"]
            )
            if result:
                QMessageBox.information(self, "Exito", "Grupo creado correctamente")
                self.refresh_data()
            else:
                QMessageBox.warning(self, "Error", "No se pudo crear el grupo")

    def edit_grupo(self):
        grupo = self.get_selected_grupo()
        if not grupo:
            QMessageBox.warning(self, "Error", "Selecciona un grupo para editar")
            return

        dialog = GroupDialog(self, grupo, self.intersections)
        if dialog.exec():
            data = dialog.result_data
            result = self.api.update_grupo(
                grupo_id=grupo["id"],
                nombre=data["nombre"],
                descripcion=data["descripcion"],
                color_grupo=data["color_grupo"],
                direccion=data["direccion"]
            )
            if result:
                QMessageBox.information(self, "Exito", "Grupo actualizado correctamente")
                self.refresh_data()
            else:
                QMessageBox.warning(self, "Error", "No se pudo actualizar el grupo")

    def delete_grupo(self):
        grupo = self.get_selected_grupo()
        if not grupo:
            QMessageBox.warning(self, "Error", "Selecciona un grupo para eliminar")
            return

        reply = QMessageBox.question(
            self, "Confirmar",
            f"Eliminar el grupo '{grupo['nombre']}'?",
            QMessageBox.Yes | QMessageBox.No
        )

        if reply == QMessageBox.Yes:
            if self.api.delete_grupo(grupo["id"]):
                QMessageBox.information(self, "Exito", "Grupo eliminado correctamente")
                self.refresh_data()
            else:
                QMessageBox.warning(self, "Error", "No se pudo eliminar el grupo")

    def start_detection(self):
        if not self.cameras:
            QMessageBox.warning(self, "Error", "No hay camaras configuradas")
            return

        from src.gui.detection_window import DetectionWindow

        cameras_data = [
            (c["name"], c["url"], c["camera_type"], c["id"], c.get("grupo_id"), c.get("interseccion_id"))
            for c in self.cameras if c.get("activo", True)
        ]

        if not cameras_data:
            QMessageBox.warning(self, "Error", "No hay camaras activas")
            return

        detection_window = DetectionWindow(cameras_data, self.api)
        detection_window.show()
        self.detection_windows.append(detection_window)

    def closeEvent(self, event):
        self.traffic_timer.stop()
        self.stats_timer.stop()
        event.accept()