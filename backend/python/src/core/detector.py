import cv2
from ultralytics import YOLO


class VehicleDetector:
    PERSON_CLASSES = {
        0: "persona"
    }

    VEHICLE_CLASSES = {
        2: "carro",
        3: "moto",
        5: "bus",
        7: "camion"
    }

    ALL_CLASSES = {**PERSON_CLASSES, **VEHICLE_CLASSES}

    def __init__(self, model_path="yolo11n.pt", confidence_threshold=0.5):
        self.model = YOLO(model_path)
        self.confidence_threshold = confidence_threshold
        self.tracked_objects = {}
        self.next_id = 0
        self.frame_count = 0

    def detect(self, frame):
        self.frame_count += 1
        results = self.model(frame, verbose=False, conf=self.confidence_threshold)
        detections = []
        counters = {
            0: 0,
            2: 0,
            3: 0,
            5: 0,
            7: 0
        }

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
                    "frame_count": self.frame_count
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
        colors = {
            0: (255, 255, 255),
            2: (0, 255, 0),
            3: (255, 255, 0),
            5: (255, 0, 0),
            7: (0, 255, 255)
        }
        return colors.get(class_id, (0, 255, 0))