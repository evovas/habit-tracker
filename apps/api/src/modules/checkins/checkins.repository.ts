import { ConflictError } from '../../shared/errors.ts';
import type { DateRangeOptional, DateRangeStrict, IsoDate } from '../../shared/types.ts';
import type { Habit } from '../habits/habits.types.ts';
import type { CheckinSingleEntry } from './checkins.types.ts';

export interface CheckinsRepository {
  findAll(range: DateRangeStrict): Promise<CheckinSingleEntry[]>;
  findByHabitId(habitId: Habit['id'], range?: DateRangeOptional): Promise<IsoDate[]>;
  /** @throws {ConflictError} if checkin for the given date already exists */
  create(habitId: Habit['id'], date: IsoDate): Promise<IsoDate>;
  delete(habitId: Habit['id'], date: IsoDate): Promise<boolean>;
  deleteByHabitId(habitId: Habit['id']): Promise<void>;
}

export class InMemoryCheckinsRepository implements CheckinsRepository {
  private readonly items = new Map<Habit['id'], Set<IsoDate>>();

  private isDateInRange = (date: IsoDate, range: DateRangeOptional): boolean =>
    (range.from ? date >= range.from : true)
    && (range.to ? date <= range.to : true);

  private stringCompare = (a: string, b: string): -1 | 1 | 0 => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  };

  async findAll(range: DateRangeStrict) {
    return this.items.entries()
      .flatMap(([habitId, dates]) =>
        dates.entries()
          .filter(([date]) =>
            this.isDateInRange(date, range),
          )
          .map(([date]) => ({
            habitId,
            date,
          }))
          .toArray(),
      )
      .toArray()
      .sort((a, b) =>
        this.stringCompare(a.date, b.date)
        || this.stringCompare(a.habitId, b.habitId),
      );
  }

  async findByHabitId(habitId: Habit['id'], range?: DateRangeOptional) {
    const habitCheckins = this.items.get(habitId);

    if (!habitCheckins) {
      return [];
    }

    return habitCheckins
      .entries()
      .map(([date]) => date)
      .filter((date) =>
        range ? this.isDateInRange(date, range) : true,
      )
      .toArray()
      .sort((a, b) => this.stringCompare(a, b));
  }

  async create(habitId: Habit['id'], date: IsoDate) {
    const habitCheckins = this.items.get(habitId);

    if (habitCheckins) {
      if (habitCheckins.has(date)) {
        throw new ConflictError(`Checkin with habitId ${habitId} and given date already exists`);
      }
      habitCheckins.add(date);
    } else {
      this.items.set(habitId, new Set([date]));
    }

    return date;
  }

  async delete(habitId: Habit['id'], date: IsoDate) {
    const habitCheckins = this.items.get(habitId);

    if (!habitCheckins) {
      return false;
    }

    return habitCheckins.delete(date);
  }

  async deleteByHabitId(habitId: Habit['id']) {
    this.items.delete(habitId);
  }
}
