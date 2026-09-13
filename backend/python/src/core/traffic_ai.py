import time
from src.core.backpressure import BackPressureController
from src.core.genetic_optimizer import GeneticOptimizer


class TrafficAI:
    def __init__(self, interseccion_id, cycle_time=120):
        self.interseccion_id = interseccion_id
        self.cycle_time = cycle_time
        self.backpressure = BackPressureController(interseccion_id, cycle_time)
        self.genetic = GeneticOptimizer()
        self.history = []
        self.last_decision = None
        self.last_decision_time = 0
        self.decision_interval = 30

    def register_phase(self, phase_id, paths):
        self.backpressure.register_phase(phase_id, paths)

    def update_traffic_data(self, traffic_data):
        for lane_data in traffic_data:
            lane_id = lane_data.get("lane_id")
            queue = lane_data.get("queue", 0)
            capacity = lane_data.get("capacity", 15)

            self.backpressure.update_queue(lane_id, queue)
            self.backpressure.update_capacity(lane_id, capacity)

    def should_decide(self):
        return time.time() - self.last_decision_time >= self.decision_interval

    def take_decision(self, traffic_data):
        self.update_traffic_data(traffic_data)

        bp_decision = self.backpressure.get_decision()

        genetic_input = []
        for lane_data in traffic_data:
            genetic_input.append({
                "queue": lane_data.get("queue", 0),
                "phases": lane_data.get("phases", [])
            })

        genetic_decision = self.genetic.optimize(genetic_input)

        final_decision = self.combine_decisions(bp_decision, genetic_decision)

        self.last_decision = final_decision
        self.last_decision_time = time.time()
        self.history.append(final_decision)

        if len(self.history) > 100:
            self.history = self.history[-100:]

        return final_decision

    def combine_decisions(self, bp_decision, genetic_decision):
        bp_weight = 0.6
        genetic_weight = 0.4

        bp_green = bp_decision.get("green_time", 30)
        genetic_greens = genetic_decision.get("green_times", [30, 30, 30, 30])

        phase = bp_decision.get("phase", 0)

        if isinstance(phase, int) and phase < len(genetic_greens):
            genetic_green = genetic_greens[phase]
        else:
            genetic_green = sum(genetic_greens) / len(genetic_greens)

        final_green = int(bp_green * bp_weight + genetic_green * genetic_weight)

        final_green = max(6, min(final_green, self.cycle_time - 18))

        return {
            "interseccion_id": self.interseccion_id,
            "phase": phase,
            "green_time": final_green,
            "bp_objective": bp_decision.get("objective"),
            "genetic_fitness": genetic_decision.get("fitness"),
            "algoritmo": "hibrido-bp-genetico",
            "timestamp": time.time()
        }

    def get_suggestions(self):
        if not self.last_decision:
            return []

        suggestions = []
        decision = self.last_decision

        green_time = decision.get("green_time", 30)

        if green_time > 40:
            suggestions.append({
                "tipo": "trafico_pesado",
                "mensaje": f"Verde extendido a {green_time}s por alto flujo",
                "accion": "Mantener monitoreo"
            })
        elif green_time < 15:
            suggestions.append({
                "tipo": "trafico_liviano",
                "mensaje": f"Verde reducido a {green_time}s por bajo flujo",
                "accion": "Considerar reducir ciclo"
            })

        if len(self.history) >= 10:
            recent_greens = [h.get("green_time", 30) for h in self.history[-10:]]
            avg_green = sum(recent_greens) / len(recent_greens)

            if avg_green > 35:
                suggestions.append({
                    "tipo": "patron",
                    "mensaje": "Flujo consistentemente alto en los ultimos 10 ciclos",
                    "accion": "Ajustar ciclo base a 150s"
                })

        return suggestions

    def get_stats(self):
        if not self.history:
            return None

        greens = [h.get("green_time", 30) for h in self.history]

        return {
            "total_decisiones": len(self.history),
            "promedio_verde": round(sum(greens) / len(greens), 2),
            "max_verde": max(greens),
            "min_verde": min(greens),
            "ultima_decision": self.last_decision
        }