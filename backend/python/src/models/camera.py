class Camera:
    def __init__(self, id=None, name="", url="", camera_type="webcam",
                 interseccion_id=None, sensor_id=None, activo=True):
        self.id = id
        self.name = name
        self.url = url
        self.camera_type = camera_type
        self.interseccion_id = interseccion_id
        self.sensor_id = sensor_id
        self.activo = activo

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "camera_type": self.camera_type,
            "interseccion_id": self.interseccion_id,
            "sensor_id": self.sensor_id,
            "activo": self.activo
        }

    @staticmethod
    def from_dict(data):
        return Camera(
            id=data.get("id"),
            name=data.get("name", ""),
            url=data.get("url", ""),
            camera_type=data.get("camera_type", "webcam"),
            interseccion_id=data.get("interseccion_id"),
            sensor_id=data.get("sensor_id"),
            activo=data.get("activo", True)
        )

    def __repr__(self):
        return f"Camera(id={self.id}, name='{self.name}', type='{self.camera_type}')"