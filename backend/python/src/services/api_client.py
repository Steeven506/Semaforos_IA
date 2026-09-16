import requests


class ApiClient:
    def __init__(self, base_url="http://localhost:3000/api"):
        self.base_url = base_url
        self.token = None
        self.user = None

    def login(self, email, password):
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json={"email": email, "password": password},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            self.token = data.get("token")
            self.user = data.get("user")
            print(f"Login exitoso: {self.user.get('email')}")
            return True
        except requests.exceptions.RequestException as e:
            print(f"Error en login: {e}")
            return False

    def _headers(self):
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    # ==================== CAMARAS ====================

    def get_cameras(self):
        try:
            response = requests.get(
                f"{self.base_url}/cameras",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo camaras: {e}")
            return []

    def create_camera(self, name, url, camera_type, interseccion_id=None, grupo_id=None):
        try:
            payload = {
                "name": name,
                "url": url,
                "camera_type": camera_type,
                "interseccion_id": interseccion_id,
                "grupo_id": grupo_id,
                "activo": True
            }
            response = requests.post(
                f"{self.base_url}/cameras",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("camera")
        except requests.exceptions.RequestException as e:
            print(f"Error creando camara: {e}")
            return None

    def update_camera(self, camera_id, name, url, camera_type, interseccion_id=None, grupo_id=None):
        try:
            payload = {
                "name": name,
                "url": url,
                "camera_type": camera_type,
                "interseccion_id": interseccion_id,
                "grupo_id": grupo_id
            }
            response = requests.put(
                f"{self.base_url}/cameras/{camera_id}",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("camera")
        except requests.exceptions.RequestException as e:
            print(f"Error actualizando camara: {e}")
            return None

    def delete_camera(self, camera_id):
        try:
            response = requests.delete(
                f"{self.base_url}/cameras/{camera_id}",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            print(f"Error eliminando camara: {e}")
            return False

    # ==================== INTERSECCIONES ====================

    def get_intersections(self):
        try:
            response = requests.get(
                f"{self.base_url}/intersections",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo intersecciones: {e}")
            return []

    def get_intersection(self, interseccion_id):
        try:
            response = requests.get(
                f"{self.base_url}/intersections/{interseccion_id}",
                headers=self._headers(),
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo interseccion: {e}")
            return None

    # ==================== GRUPOS ====================

    def get_grupos(self):
        try:
            response = requests.get(
                f"{self.base_url}/grupos",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo grupos: {e}")
            return []

    def get_grupo(self, grupo_id):
        try:
            response = requests.get(
                f"{self.base_url}/grupos/{grupo_id}",
                headers=self._headers(),
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo grupo: {e}")
            return None

    def get_grupos_by_intersection(self, interseccion_id):
        try:
            response = requests.get(
                f"{self.base_url}/grupos/interseccion/{interseccion_id}",
                headers=self._headers(),
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo grupos: {e}")
            return []

    def get_grupos_interseccion(self, interseccion_id):
        return self.get_grupos_by_intersection(interseccion_id)

    def create_grupo(self, interseccion_id, nombre, descripcion, color_grupo, direccion,
                     tiempo_verde=30, tiempo_amarillo=5, tiempo_rojo=25, offset_segundos=0):
        try:
            payload = {
                "interseccion_id": interseccion_id,
                "nombre": nombre,
                "descripcion": descripcion,
                "color_grupo": color_grupo,
                "direccion": direccion,
                "tiempo_verde": tiempo_verde,
                "tiempo_amarillo": tiempo_amarillo,
                "tiempo_rojo": tiempo_rojo,
                "offset_segundos": offset_segundos
            }
            response = requests.post(
                f"{self.base_url}/grupos",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("grupo")
        except requests.exceptions.RequestException as e:
            print(f"Error creando grupo: {e}")
            return None

    def update_grupo(self, grupo_id, nombre, descripcion, color_grupo, direccion,
                     tiempo_verde=None, tiempo_amarillo=None, tiempo_rojo=None, offset_segundos=None):
        try:
            payload = {
                "nombre": nombre,
                "descripcion": descripcion,
                "color_grupo": color_grupo,
                "direccion": direccion
            }
            if tiempo_verde is not None:
                payload["tiempo_verde"] = tiempo_verde
            if tiempo_amarillo is not None:
                payload["tiempo_amarillo"] = tiempo_amarillo
            if tiempo_rojo is not None:
                payload["tiempo_rojo"] = tiempo_rojo
            if offset_segundos is not None:
                payload["offset_segundos"] = offset_segundos

            response = requests.put(
                f"{self.base_url}/grupos/{grupo_id}",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("grupo")
        except requests.exceptions.RequestException as e:
            print(f"Error actualizando grupo: {e}")
            return None

    def delete_grupo(self, grupo_id):
        try:
            response = requests.delete(
                f"{self.base_url}/grupos/{grupo_id}",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return True
        except requests.exceptions.RequestException as e:
            print(f"Error eliminando grupo: {e}")
            return False

    def cambiar_estado_grupo(self, grupo_id, estado):
        try:
            payload = {"estado": estado}
            response = requests.post(
                f"{self.base_url}/grupos/{grupo_id}/estado",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("grupo")
        except requests.exceptions.RequestException as e:
            print(f"Error cambiando estado del grupo: {e}")
            return None

    def activar_modo_automatico_grupo(self, grupo_id):
        try:
            response = requests.post(
                f"{self.base_url}/grupos/{grupo_id}/automatico",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("grupo")
        except requests.exceptions.RequestException as e:
            print(f"Error activando modo automatico: {e}")
            return None

    def actualizar_tiempos_grupo(self, grupo_id, tiempo_verde=None, tiempo_amarillo=None, tiempo_rojo=None):
        try:
            payload = {}
            if tiempo_verde is not None:
                payload["tiempo_verde"] = tiempo_verde
            if tiempo_amarillo is not None:
                payload["tiempo_amarillo"] = tiempo_amarillo
            if tiempo_rojo is not None:
                payload["tiempo_rojo"] = tiempo_rojo

            response = requests.put(
                f"{self.base_url}/grupos/{grupo_id}/tiempos",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("grupo")
        except requests.exceptions.RequestException as e:
            print(f"Error actualizando tiempos: {e}")
            return None

    # ==================== ESTADO DE SEMAFOROS ====================

    def get_estado_grupo(self, grupo_id):
        try:
            response = requests.get(
                f"{self.base_url}/grupos/{grupo_id}",
                headers=self._headers(),
                timeout=5
            )
            response.raise_for_status()
            grupo = response.json()
            return {
                "estado": grupo.get("estado_actual", "verde"),
                "modo_automatico": grupo.get("modo_automatico", True),
                "tiempo_verde": grupo.get("tiempo_verde", 30),
                "tiempo_amarillo": grupo.get("tiempo_amarillo", 5),
                "tiempo_rojo": grupo.get("tiempo_rojo", 25)
            }
        except requests.exceptions.RequestException as e:
            return None

    def get_estados_interseccion(self, interseccion_id):
        try:
            response = requests.get(
                f"{self.base_url}/ia/estados/{interseccion_id}",
                headers=self._headers(),
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return []

    # ==================== DETECCIONES ====================

    def get_today_stats(self):
        try:
            response = requests.get(
                f"{self.base_url}/detections/stats/today",
                headers=self._headers(),
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error obteniendo estadisticas: {e}")
            return None

    def save_detection(self, camera_id, counters, interseccion_id=None):
        try:
            payload = {
                "camera_id": camera_id,
                "interseccion_id": interseccion_id,
                "personas": counters.get(0, 0),
                "carros": counters.get(2, 0),
                "motos": counters.get(3, 0),
                "buses": counters.get(5, 0),
                "camiones": counters.get(7, 0)
            }
            response = requests.post(
                f"{self.base_url}/detections",
                headers=self._headers(),
                json=payload,
                timeout=10
            )
            response.raise_for_status()
            return response.json().get("detection")
        except requests.exceptions.RequestException as e:
            print(f"Error guardando deteccion: {e}")
            return None

    # ==================== DECISIONES IA ====================

    def tomar_decision_ia(self, interseccion_id, grupo_id=None):
        try:
            payload = {
                "interseccion_id": interseccion_id,
                "grupo_id": grupo_id
            }
            response = requests.post(
                f"{self.base_url}/ia/decision",
                headers=self._headers(),
                json=payload,
                timeout=15
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error tomando decision IA: {e}")
            return None