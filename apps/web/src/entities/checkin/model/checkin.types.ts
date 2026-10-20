import type { z } from 'zod';

import type { zCheckinEntry } from './checkin.validator.ts';

export type CheckinEntry = z.infer<typeof zCheckinEntry>;
