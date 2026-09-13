from PySide6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QLineEdit, QPushButton, QFrame, QMessageBox, QSpacerItem,
    QSizePolicy
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QFont

from src.gui.styles import GLOBAL_STYLE, COLORS


class LoginWindow(QMainWindow):
    login_successful = Signal(dict)

    def __init__(self, api_client):
        super().__init__()
        self.api = api_client
        self.setWindowTitle("Traffic System - Iniciar Sesion")
        self.setFixedSize(480, 620)
        self.setStyleSheet(GLOBAL_STYLE)
        self.setup_ui()

    def setup_ui(self):
        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(20)

        layout.addSpacerItem(QSpacerItem(20, 20, QSizePolicy.Minimum, QSizePolicy.Fixed))

        logo_label = QLabel("🚦")
        logo_label.setAlignment(Qt.AlignCenter)
        logo_label.setStyleSheet("font-size: 60px;")
        layout.addWidget(logo_label)

        title = QLabel("Traffic System")
        title.setObjectName("title")
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)

        subtitle = QLabel("Sistema de Trafico Inteligente")
        subtitle.setObjectName("subtitle")
        subtitle.setAlignment(Qt.AlignCenter)
        layout.addWidget(subtitle)

        location = QLabel("Ocana, Norte de Santander")
        location.setObjectName("subtitle")
        location.setAlignment(Qt.AlignCenter)
        layout.addWidget(location)

        layout.addSpacing(20)

        card = QFrame()
        card.setObjectName("card")
        card_layout = QVBoxLayout(card)
        card_layout.setContentsMargins(30, 30, 30, 30)
        card_layout.setSpacing(15)

        login_title = QLabel("Iniciar Sesion")
        login_title.setObjectName("section")
        login_title.setAlignment(Qt.AlignCenter)
        card_layout.addWidget(login_title)

        card_layout.addSpacing(10)

        email_label = QLabel("Correo Electronico")
        email_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        card_layout.addWidget(email_label)

        self.email_input = QLineEdit()
        self.email_input.setPlaceholderText("admin@traffic.com")
        self.email_input.setText("admin@traffic.com")
        card_layout.addWidget(self.email_input)

        password_label = QLabel("Contrasena")
        password_label.setStyleSheet(f"color: {COLORS['text_secondary']}; font-size: 12px;")
        card_layout.addWidget(password_label)

        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("••••••••")
        self.password_input.setText("admin123")
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.returnPressed.connect(self.handle_login)
        card_layout.addWidget(self.password_input)

        self.status_label = QLabel("")
        self.status_label.setObjectName("error")
        self.status_label.setAlignment(Qt.AlignCenter)
        self.status_label.setVisible(False)
        card_layout.addWidget(self.status_label)

        card_layout.addSpacing(10)

        self.login_button = QPushButton("Iniciar Sesion")
        self.login_button.setObjectName("success")
        self.login_button.setMinimumHeight(45)
        self.login_button.clicked.connect(self.handle_login)
        card_layout.addWidget(self.login_button)

        layout.addWidget(card)

        layout.addStretch()

        info_label = QLabel("Credenciales por defecto:\nadmin@traffic.com / admin123")
        info_label.setObjectName("subtitle")
        info_label.setAlignment(Qt.AlignCenter)
        info_label.setStyleSheet(f"color: {COLORS['text_muted']}; font-size: 11px;")
        layout.addWidget(info_label)

    def handle_login(self):
        email = self.email_input.text().strip()
        password = self.password_input.text().strip()

        if not email or not password:
            self.show_error("Ingresa email y contrasena")
            return

        self.status_label.setText("Conectando...")
        self.status_label.setObjectName("success")
        self.status_label.setStyleSheet(f"color: {COLORS['accent_green']}; font-size: 12px;")
        self.status_label.setVisible(True)
        self.login_button.setEnabled(False)

        from PySide6.QtCore import QTimer
        QTimer.singleShot(100, lambda: self._do_login(email, password))

    def _do_login(self, email, password):
        success = self.api.login(email, password)

        if success:
            self.status_label.setText(f"Conectado: {email}")
            self.status_label.setStyleSheet(f"color: {COLORS['accent_green']}; font-size: 12px;")

            from PySide6.QtCore import QTimer
            QTimer.singleShot(500, lambda: self.login_successful.emit(self.api.user))
        else:
            self.login_button.setEnabled(True)
            self.show_error("Credenciales invalidas")

    def show_error(self, message):
        self.status_label.setText(message)
        self.status_label.setStyleSheet(f"color: {COLORS['accent_red']}; font-size: 12px;")
        self.status_label.setVisible(True)