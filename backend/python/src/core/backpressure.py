from collections import defaultdict
import time


class BackPressureController:
    def __init__(self, interseccion_id, cycle_time=120):
        self.interseccion_id = interseccion_id
        self.queue_lengths = defaultdict(int)
        self.lane_capacities = defaultdict(lambda: 15)
        self.turning_ratios = defaultdict(lambda: 0.5)
        self.min_green = 6
        self.cycle_time = cycle_time
        self.num_phases = 4
        self.phases = {}

    def update_queue(self, lane_id, queue_length):
        self.queue_lengths[lane_id] = queue_length

    def update_capacity(self, lane_id, capacity):
        self.lane_capacities[lane_id] = capacity

    def update_turning_ratio(self, from_lane, to_lane, ratio):
        self.turning_ratios[(from_lane, to_lane)] = ratio

    def register_phase(self, phase_id, paths):
        self.phases[phase_id] = paths

    def calculate_pressure(self, lane_id, use_capacity=True):
        q = self.queue_lengths[lane_id]

        if not use_capacity:
            return q

        c_lane = self.lane_capacities[lane_id]
        c_inf = 200
        m = 2.0

        if c_lane == 0:
            return 1.0

        occupancy = q / c_lane
        if occupancy >= 1:
            return 1.0

        numerator = (q / c_inf) + (2 - q / c_inf) * (occupancy ** m)
        denominator = 1 + (occupancy ** (m - 1))

        return min(1.0, numerator / denominator)

    def calculate_pressure_difference(self, from_lane, to_lane):
        pr_from = self.calculate_pressure(from_lane)
        pr_to = self.calculate_pressure(to_lane)
        has_vehicles = 1 if self.queue_lengths[from_lane] > 0 else 0
        return has_vehicles * max(pr_from - pr_to, 0)

    def calculate_adaptive_pressure(self, from_lane, to_lane):
        q_from_to = self.queue_lengths.get((from_lane, to_lane), 0)

        downstream_pressure = 0
        for (l1, l2), ratio in self.turning_ratios.items():
            if l1 == to_lane:
                downstream_pressure += ratio * self.queue_lengths.get((l1, l2), 0)

        return q_from_to - downstream_pressure

    def select_optimal_phase(self):
        best_phase = None
        best_objective = -1
        phase_objectives = {}

        for phase_id, paths in self.phases.items():
            objective = 0
            for path in paths:
                from_lane = path.get("from")
                to_lane = path.get("to")
                weight = path.get("weight", 1.0)
                delta_pr = self.calculate_pressure_difference(from_lane, to_lane)
                objective += weight * delta_pr

            phase_objectives[phase_id] = objective

            if objective > best_objective:
                best_objective = objective
                best_phase = phase_id

        return best_phase, best_objective, phase_objectives

    def calculate_green_time(self, phase_pressure, total_pressure):
        if total_pressure <= 0:
            return self.cycle_time // self.num_phases

        ratio = phase_pressure / total_pressure
        green_time = int(ratio * self.cycle_time)

        green_time = max(self.min_green, green_time)

        max_green = self.cycle_time - (self.num_phases - 1) * self.min_green
        green_time = min(green_time, max_green)

        return green_time

    def get_decision(self):
        phase, objective, all_objectives = self.select_optimal_phase()

        total_pressure = sum(all_objectives.values())
        green_time = self.calculate_green_time(objective, total_pressure)

        return {
            "interseccion_id": self.interseccion_id,
            "phase": phase,
            "objective": round(objective, 4),
            "green_time": green_time,
            "cycle_time": self.cycle_time,
            "all_objectives": {k: round(v, 4) for k, v in all_objectives.items()},
            "algoritmo": "back-pressure",
            "timestamp": time.time()
        }