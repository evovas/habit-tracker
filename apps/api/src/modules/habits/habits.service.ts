import { randomUUID } from 'node:crypto';

import { NotFoundError, ValidationError } from '../../shared/errors.ts';
import type { CheckinsRepository } from '../checkins/checkins.repository.ts';
import { HabitsErrorCode } from './habits.errors.ts';
import type { HabitsRepository } from './habits.repository.ts';
import type { CreateHabitInput, Habit, UpdateHabitInput } from './habits.types.ts';

export class HabitsService {
  // private readonly habits: HabitsRepository;
  // constructor(habits: HabitsRepository) {
  //   this.habits = habits;
  // }
  constructor(
    private readonly habits: HabitsRepository,
    private readonly checkins: CheckinsRepository,
  ) {}

  private normalizeHabit(habit: Habit): Habit {
    return {
      ...habit,
      activeDays: habit.activeDays.toSorted((a, b) => a - b),
      name: habit.name.trim(),
    };
  }

  private validateHabit(habit: Habit) {
    const { activeDays, weekGoal, name } = habit;

    if (!activeDays.length) {
      throw new ValidationError(
        'activeDays can\'t be empty',
        HabitsErrorCode.DAYS_EMPTY,
      );
    }

    if (activeDays.length > new Set(activeDays).size) {
      throw new ValidationError(
        'Entries in the activeDays must be unique',
        HabitsErrorCode.DAYS_NOT_UNIQUE,
      );
    }

    if (weekGoal > activeDays.length) {
      throw new ValidationError(
        'weekGoal can\'t be greater than activeDays count',
        HabitsErrorCode.GOAL_EXCEEDS_DAYS,
      );
    }

    if (!name) {
      throw new ValidationError(
        'name can\'t be empty',
        HabitsErrorCode.NAME_EMPTY,
      );
    }
  }

  async getHabitsList(): Promise<Habit[]> {
    return this.habits.findAll();
  }

  async getHabitById(id: Habit['id']): Promise<Habit> {
    const habit = await this.habits.findById(id);

    if (!habit) {
      throw new NotFoundError(
        `Habit with id ${id} not found`,
        HabitsErrorCode.NOT_FOUND,
      );
    }

    return habit;
  }

  async createHabit(input: CreateHabitInput): Promise<Habit> {
    const habit: Habit = this.normalizeHabit({
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    });
    this.validateHabit(habit);
    return this.habits.create(habit);
  }

  async updateHabit(id: Habit['id'], input: UpdateHabitInput): Promise<Habit> {
    const existing = await this.habits.findById(id);

    if (!existing) {
      throw new NotFoundError(
        `Habit with id ${id} not found`,
        HabitsErrorCode.NOT_FOUND,
      );
    }

    const updated: Habit = this.normalizeHabit({
      ...existing,
      ...input,
      id: existing.id,
      createdAt: existing.createdAt,
    });
    this.validateHabit(updated);
    return this.habits.update(updated);
  }

  async deleteHabit(id: Habit['id']): Promise<void> {
    const isDeleted = await this.habits.delete(id);
    if (!isDeleted) {
      throw new NotFoundError(
        `Habit with id ${id} not found`,
        HabitsErrorCode.NOT_FOUND,
      );
    }

    await this.checkins.deleteByHabitId(id);
  }
}
