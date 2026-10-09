import { pgTable, smallint, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const habitsTable = pgTable('habits', {
  id: uuid().primaryKey(),
  name: varchar({ length: 120 }).notNull(),
  activeDays: smallint().array().notNull(),
  weekGoal: smallint().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
