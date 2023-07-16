import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CommunityCountOutputTypeSelectSchema } from './CommunityCountOutputTypeSelectSchema';

export const CommunityCountOutputTypeArgsSchema: z.ZodType<Prisma.CommunityCountOutputTypeArgs> = z.object({
  select: z.lazy(() => CommunityCountOutputTypeSelectSchema).nullish(),
}).strict();

export default CommunityCountOutputTypeSelectSchema;
