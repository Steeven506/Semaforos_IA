import time


class TrafficLight:
    def __init__(self, camera_id, interseccion_id=None, grupo_id=None, 
                 cycle_duration=45, start_offset=0):
        self.camera_id = camera_id
        self.interseccion_id = interseccion_id
        self.grupo_id = grupo_id
        self.cycle_duration = cycle_duration
        self.green_duration = 25
        self.yellow_duration = 5
        self.red_duration = 15
        self.start_time = time.time() + start_offset
        self.state = "green"
        self.remaining = self.green_duration
        self.total_vehicles = 0

    def update(self, vehicle_count=0):
        elapsed = time.time() - self.start_time
        self.total_vehicles = vehicle_count

        if vehicle_count > 10:
            self.green_duration = 35
            self.yellow_duration = 5
            self.red_duration = 10
        elif vehicle_count > 5:
            self.green_duration = 30
            self.yellow_duration = 5
            self.red_duration = 15
        else:
            self.green_duration = 20
            self.yellow_duration = 5
            self.red_duration = 25

        total_cycle = self.green_duration + self.yellow_duration + self.red_duration
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
            "vehicles": self.total_vehicles
        }