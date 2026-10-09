import { and, asc, DrizzleQueryError, eq, gte, lte } from 'drizzle-orm';
import { DatabaseError } from 'pg';

import type { Db } from '../../db/client.ts';
import { ConflictError } from '../../shared/errors.ts';
import type { DateRangeOptional, DateRangeStrict, IsoDate } from '../../shared/types.ts';
import type { Habit } from '../habits/habits.types.ts';
import type { CheckinsRepository } from './checkins.repository.ts';
import { checkinsTable } from './checkins.table.ts';

const UNIQUE_VIOLATION = '23505';
const isUniqueViolation = (err: unknown): boolean =>
  err instanceof DrizzleQueryError
  && err.cause instanceof DatabaseError
  && err.cause.code === UNIQUE_VIOLATION;

export class PostgresCheckinsRepository implements CheckinsRepository {
  constructor(private readonly db: Db) {}

  async findAll(range: DateRangeStrict) {
    return await this.db
      .select()
      .from(checkinsTable)
      .where(and(
        gte(checkinsTable.date, range.from),
        lte(checkinsTable.date, range.to),
      ))
      .orderBy(
        asc(checkinsTable.date),
        asc(checkinsTable.habitId),
      );
  }

  async findByHabitId(habitId: Habit['id'], range?: DateRangeOptional) {
    const rows = await this.db
      .select()
      .from(checkinsTable)
      .where(and(
        eq(checkinsTable.habitId, habitId),
        range?.from ? gte(checkinsTable.date, range.from) : undefined,
        range?.to ? lte(checkinsTable.date, range.to) : undefined,
      ))
      .orderBy(asc(checkinsTable.date));

    return rows.map((row) => row.date);
  }

  async create(habitId: Habit['id'], date: IsoDate) {
    try {
      await this.db
        .insert(checkinsTable)
        .values({ habitId, date });
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictError(`Checkin with habitId ${habitId} and given date already exists`);
      }
      throw err;
    }
    return date;
  }

  async delete(habitId: Habit['id'], date: IsoDate) {
    const rows = await this.db
      .delete(checkinsTable)
      .where(and(
        eq(checkinsTable.habitId, habitId),
        eq(checkinsTable.date, date),
      ))
      .returning();

    return rows.length > 0;
  }

  async deleteByHabitId(habitId: Habit['id']) {
    await this.db
      .delete(checkinsTable)
      .where(eq(checkinsTable.habitId, habitId));
  }
}
