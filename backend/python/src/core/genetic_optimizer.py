import random


class GeneticOptimizer:
    def __init__(self, population_size=50, generations=100, mutation_rate=0.1):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = mutation_rate
        self.min_green = 6
        self.cycle_time = 120
        self.num_phases = 4

    def generate_individual(self):
        max_green = self.cycle_time - (self.num_phases - 1) * self.min_green
        individual = []
        remaining = self.cycle_time

        for i in range(self.num_phases):
            if i == self.num_phases - 1:
                individual.append(remaining)
            else:
                max_val = min(max_green, remaining - (self.num_phases - 1 - i) * self.min_green)
                val = random.randint(self.min_green, max(self.min_green, max_val))
                individual.append(val)
                remaining -= val

        return individual

    def fitness(self, individual, traffic_data):
        total_delay = 0

        for i, green_time in enumerate(individual):
            for lane_data in traffic_data:
                if i in lane_data.get("phases", []):
                    queue = lane_data.get("queue", 0)
                    delay = queue * (self.cycle_time - green_time)
                    total_delay += delay

        return -total_delay

    def selection(self, population, fitnesses):
        total_fitness = sum(fitnesses)

        if total_fitness == 0:
            return random.choice(population)

        pick = random.uniform(0, total_fitness)
        current = 0

        for i, fitness in enumerate(fitnesses):
            current += fitness
            if current >= pick:
                return population[i]

        return population[-1]

    def crossover(self, parent1, parent2):
        point = random.randint(1, self.num_phases - 1)
        child = parent1[:point] + parent2[point:]
        return self.normalize(child)

    def mutate(self, individual):
        if random.random() < self.mutation_rate:
            idx = random.randint(0, self.num_phases - 1)
            individual[idx] += random.randint(-3, 3)
        return self.normalize(individual)

    def normalize(self, individual):
        total = sum(individual)

        if total != self.cycle_time:
            factor = self.cycle_time / total
            individual = [max(self.min_green, int(g * factor)) for g in individual]
            diff = self.cycle_time - sum(individual)
            individual[-1] += diff

        return individual

    def optimize(self, traffic_data):
        population = [self.generate_individual() for _ in range(self.population_size)]

        for generation in range(self.generations):
            fitnesses = [self.fitness(ind, traffic_data) for ind in population]
            new_population = []

            for _ in range(self.population_size):
                p1 = self.selection(population, fitnesses)
                p2 = self.selection(population, fitnesses)
                child = self.crossover(p1, p2)
                child = self.mutate(child)
                new_population.append(child)

            population = new_population

        fitnesses = [self.fitness(ind, traffic_data) for ind in population]
        best_idx = fitnesses.index(max(fitnesses))

        return {
            "green_times": population[best_idx],
            "fitness": fitnesses[best_idx],
            "algoritmo": "genetico",
            "cycle_time": self.cycle_time
        }