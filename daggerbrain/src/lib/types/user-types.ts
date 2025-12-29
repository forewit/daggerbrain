import { users_table_schema } from '$lib/server/db/users.schema';
import { z } from 'zod';

export type User = z.infer<typeof users_table_schema>;
