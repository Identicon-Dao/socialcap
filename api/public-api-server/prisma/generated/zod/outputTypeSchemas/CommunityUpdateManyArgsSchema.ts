import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CommunityUpdateManyMutationInputSchema } from '../inputTypeSchemas/CommunityUpdateManyMutationInputSchema'
import { CommunityUncheckedUpdateManyInputSchema } from '../inputTypeSchemas/CommunityUncheckedUpdateManyInputSchema'
import { CommunityWhereInputSchema } from '../inputTypeSchemas/CommunityWhereInputSchema'

export const CommunityUpdateManyArgsSchema: z.ZodType<Prisma.CommunityUpdateManyArgs> = z.object({
  data: z.union([ CommunityUpdateManyMutationInputSchema,CommunityUncheckedUpdateManyInputSchema ]),
  where: CommunityWhereInputSchema.optional(),
}).strict()

export default CommunityUpdateManyArgsSchema;
