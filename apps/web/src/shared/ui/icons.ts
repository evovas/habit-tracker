import {
  Add01Icon,
  CalendarCheckIcon,
  CalendarCheckOut02Icon,
  Cancel01Icon,
  ChartAnalysisIcon,
  CheckListIcon,
  Delete02Icon,
  Menu01Icon,
  Pen01Icon,
  Settings01Icon,
  TextIcon,
  TextNumberSignIcon,
} from '@hugeicons/core-free-icons';

export const sidebarIcons = {
  today: CalendarCheckIcon,
  week: CalendarCheckOut02Icon,
  habits: CheckListIcon,
  statistics: ChartAnalysisIcon,
  settings: Settings01Icon,
} as const;

export const icons = {
  add: Add01Icon,
  close: Cancel01Icon,
  delete: Delete02Icon,
  edit: Pen01Icon,
  menu: Menu01Icon,
  text: TextIcon,
  number: TextNumberSignIcon,
} as const;

export type IconName = keyof typeof icons;
