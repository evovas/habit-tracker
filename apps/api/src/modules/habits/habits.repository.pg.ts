import { asc, eq } from 'drizzle-orm';

import type { Db } from '../../db/client.ts';
import type { HabitsRepository } from './habits.repository.ts';
import { habitsTable } from './habits.table.ts';
import type { Habit } from './habits.types.ts';

type HabitRow = typeof habitsTable.$inferSelect;

const toHabit = (row: HabitRow): Habit => ({
  id: row.id,
  name: row.name,
  activeDays: row.activeDays,
  weekGoal: row.weekGoal,
  createdAt: row.createdAt.toISOString(),
});

const toRow = (habit: Habit): HabitRow => ({
  ...habit,
  createdAt: new Date(habit.createdAt),
});

export class PostgresHabitsRepository implements HabitsRepository {
  constructor(private readonly db: Db) {}

  async findAll() {
    const rows = await this.db
      .select()
      .from(habitsTable)
      .orderBy(asc(habitsTable.createdAt));

    return rows.map(toHabit);
  }

  async findById(id: Habit['id']) {
    const [row] = await this.db
      .select()
      .from(habitsTable)
      .where(eq(habitsTable.id, id))
      .limit(1);

    return row ? toHabit(row) : undefined;
  }

  async create(data: Habit) {
    const [row] = await this.db
      .insert(habitsTable)
      .values(toRow(data))
      .returning();

    if (!row) {
      throw new Error('Insert returned no rows');
    }

    return toHabit(row);
  }

  async update(data: Habit) {
    const { id, ...changes } = toRow(data);

    const [row] = await this.db
      .update(habitsTable)
      .set(changes)
      .where(eq(habitsTable.id, id))
      .returning();

    if (!row) {
      throw new Error(`Habit ${id} disappeared during update`);
    }

    return toHabit(row);
  }

  async delete(id: Habit['id']) {
    const deleted = await this.db
      .delete(habitsTable)
      .where(eq(habitsTable.id, id))
      .returning({ id: habitsTable.id });

    return deleted.length > 0;
  }
}
