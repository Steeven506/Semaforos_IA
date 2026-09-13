import sys
from PySide6.QtWidgets import QApplication

from src.services.api_client import ApiClient
from src.gui.login_window import LoginWindow
from src.gui.main_window import MainWindow


class TrafficApp:
    def __init__(self):
        self.api = ApiClient()
        self.login_window = None
        self.main_window = None

    def start(self):
        self.show_login()

    def show_login(self):
        self.login_window = LoginWindow(self.api)
        self.login_window.login_successful.connect(self.on_login_success)
        self.login_window.show()

    def on_login_success(self, user):
        self.login_window.close()
        self.show_main_window()

    def show_main_window(self):
        self.main_window = MainWindow(self.api)
        self.main_window.show()


def main():
    app = QApplication(sys.argv)
    app.setStyle('Fusion')

    traffic_app = TrafficApp()
    traffic_app.start()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()