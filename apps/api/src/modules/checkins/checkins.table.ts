import { date, index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { habitsTable } from '../habits/habits.table.ts';

export const checkinsTable = pgTable(
  'checkins',
  {
    habitId: uuid()
      .notNull()
      .references(() => habitsTable.id, { onDelete: 'cascade' }),
    date: date().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.habitId, table.date] }),
    index().on(table.date),
  ],
);
