import time


class TrafficLight:
    def __init__(self, camera_id, interseccion_id=None, grupo_id=None,
                 cycle_duration=60, start_offset=0,
                 tiempo_verde=30, tiempo_amarillo=5, tiempo_rojo=25,
                 estado_actual=None, modo_automatico=True):
        self.camera_id = camera_id
        self.interseccion_id = interseccion_id
        self.grupo_id = grupo_id
        self.cycle_duration = cycle_duration
        self.green_duration = tiempo_verde
        self.yellow_duration = tiempo_amarillo
        self.red_duration = tiempo_rojo
        self.start_time = time.time() + start_offset
        self.state = "green"
        self.remaining = self.green_duration
        self.total_vehicles = 0
        self.forced_state = None
        self.modo_automatico = modo_automatico
        self.last_server_sync = 0

        if estado_actual and not modo_automatico:
            self.force_state(estado_actual)

    def update(self, vehicle_count=0):
        if self.forced_state:
            self.state = self.forced_state
            self.remaining = max(0, self.remaining - 1)
            if self.remaining <= 0:
                self.forced_state = None
            return self.state, self.remaining

        elapsed = time.time() - self.start_time
        self.total_vehicles = vehicle_count

        total_cycle = self.green_duration + self.yellow_duration + self.red_duration
        if total_cycle <= 0:
            total_cycle = 60

        cycle_time = elapsed % total_cycle

        if cycle_time < self.green_duration:
            self.state = "green"
            self.remaining = int(self.green_duration - cycle_time)
        elif cycle_time < self.green_duration + self.yellow_duration:
            self.state = "yellow"
            self.remaining = int(self.green_duration + self.yellow_duration - cycle_time)
        else:
            self.state = "red"
            self.remaining = int(total_cycle - cycle_time)

        return self.state, self.remaining

    def force_state(self, estado):
        self.forced_state = estado
        self.state = estado
        self.start_time = time.time()

        if estado == "verde":
            self.remaining = self.green_duration
        elif estado == "amarillo":
            self.remaining = self.yellow_duration
        else:
            self.remaining = self.red_duration

    def clear_force(self):
        self.forced_state = None
        self.start_time = time.time()

    def update_config(self, tiempo_verde=None, tiempo_amarillo=None, tiempo_rojo=None,
                      estado_actual=None, modo_automatico=None):
        if tiempo_verde is not None:
            self.green_duration = tiempo_verde
        if tiempo_amarillo is not None:
            self.yellow_duration = tiempo_amarillo
        if tiempo_rojo is not None:
            self.red_duration = tiempo_rojo

        if modo_automatico is not None:
            self.modo_automatico = modo_automatico

        if modo_automatico is False and estado_actual:
            self.force_state(estado_actual)
        elif modo_automatico is True:
            self.clear_force()

    def get_display(self):
        if self.state == "green":
            return "●\n○\n○", "#10b981"
        elif self.state == "yellow":
            return "○\n●\n○", "#f59e0b"
        else:
            return "○\n○\n●", "#ef4444"

    def get_status_text(self):
        if self.state == "green":
            return f"VERDE: {self.remaining}s"
        elif self.state == "yellow":
            return f"AMARILLO: {self.remaining}s"
        else:
            return f"ROJO: {self.remaining}s"

    def to_dict(self):
        return {
            "camera_id": self.camera_id,
            "interseccion_id": self.interseccion_id,
            "grupo_id": self.grupo_id,
            "state": self.state,
            "remaining": self.remaining,
            "vehicles": self.total_vehicles,
            "modo_automatico": self.modo_automatico,
            "tiempo_verde": self.green_duration,
            "tiempo_amarillo": self.yellow_duration,
            "tiempo_rojo": self.red_duration
        }