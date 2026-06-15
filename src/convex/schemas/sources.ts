import { z } from 'zod';
import { SourceKeySchema } from './rules';

export const SourceMetadataSchema = z.object({
	source_key: SourceKeySchema,
	name: z.string(),
	short_title: z.string()
});
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;
