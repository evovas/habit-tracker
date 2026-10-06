import { dayjs, formatToISODate, getISOWeekDay } from '../../shared/dates.ts';
import { ConflictError, NotFoundError, UnprocessableError, ValidationError } from '../../shared/errors.ts';
import type { DateRange, IsoDate } from '../../shared/types.ts';
import type { HabitsRepository } from '../habits/habits.repository.ts';
import type { Habit } from '../habits/habits.types.ts';
import type { CheckinsRepository } from './checkins.repository.ts';
import { getDaysStreakForHabit, getWeeksStreakForHabit } from './checkins.streaks.ts';
import type { CheckinSingleEntry, CheckinStatistics } from './checkins.types.ts';

export const getMaximumAllowableDate = (): IsoDate =>
  formatToISODate(dayjs.utc().add(1, 'day'));

export class CheckinsService {
  constructor(
    private readonly checkins: CheckinsRepository,
    private readonly habits: HabitsRepository,
  ) {}

  private validateCheckin(
    habit: Habit | undefined,
    date: IsoDate,
  ): asserts habit is Habit {
    if (!habit) {
      throw new NotFoundError(`Habit with given id does not exists`);
    }

    if (date > getMaximumAllowableDate()) {
      throw new ValidationError('It is not possible to perform a transaction with a future date');
    }
  }

  async createCheckin(habitId: Habit['id'], date: IsoDate): Promise<CheckinSingleEntry> {
    const habit = await this.habits.findById(habitId);
    this.validateCheckin(habit, date);

    if (!habit.activeDays.includes(getISOWeekDay(date))) {
      throw new UnprocessableError('Can not create checkin for habit\'s inactive day');
    }

    if (await this.checkins.checkExists(habitId, date)) {
      throw new ConflictError(`Checkin with habitId ${habitId} and given date already exists`);
    }

    await this.checkins.create(habitId, date);
    return { habitId, date };
  }

  async deleteCheckin(habitId: Habit['id'], date: IsoDate): Promise<void> {
    const isDeleted = await this.checkins.delete(habitId, date);

    if (!isDeleted) {
      throw new NotFoundError(`Checkin with habitId ${habitId} and given date not found`);
    }
  }

  async getCheckinsByDateRange(
    range: DateRange,
  ): Promise<CheckinSingleEntry[]> {
    if (range.to && range.to < range.from) {
      throw new ValidationError('End date of range can\'t be less than start date');
    }

    return await this.checkins.findAll({
      from: range.from,
      to: range.to ?? getMaximumAllowableDate(),
    });
  }

  async getStatistics(
    today: IsoDate,
  ): Promise<CheckinStatistics> {
    const habits = await this.habits.findAll();
    return Promise.all(habits.map(async (habit) => {
      const checkins = new Set(await this.checkins.findByHabitId(habit.id));
      return {
        habitId: habit.id,
        dayStreak: getDaysStreakForHabit(habit, checkins, today),
        weekStreak: getWeeksStreakForHabit(habit, checkins, today),
      };
    }));
  }
}
