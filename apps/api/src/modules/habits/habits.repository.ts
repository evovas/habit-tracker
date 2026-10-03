import type { Habit } from './habits.types.ts';

export interface HabitsRepository {
  findAll(): Promise<Habit[]>;
  findById(id: Habit['id']): Promise<Habit | undefined>;
  create(data: Habit): Promise<Habit>;
  update(data: Habit): Promise<Habit>;
  delete(id: Habit['id']): Promise<boolean>;
}

export class InMemoryHabitsRepository implements HabitsRepository {
  private readonly items = new Map<Habit['id'], Habit>();

  async findAll() {
    return [...this.items.values()];
  }

  async findById(id: Habit['id']) {
    return this.items.get(id);
  }

  async create(data: Habit) {
    this.items.set(data.id, data);
    return data;
  }

  async update(data: Habit) {
    this.items.set(data.id, data);
    return data;
  }

  async delete(id: Habit['id']) {
    return this.items.delete(id);
  }
}
