import { z } from 'zod';

export const DiceTypeSchema = z.enum([
	'd4',
	'd6',
	'd8',
	'd10',
	'd12',
	'd20',
	'hope',
	'fear',
	'advantage',
	'disadvantage'
]);
export type DiceType = z.infer<typeof DiceTypeSchema>;

export const RollSchema = z.object({
	id: z.string(),
	name: z.string(),
	isReroll: z.boolean().optional(),
	rerollingDieIndices: z.array(z.number().int()).optional(),
	dice: z.array(
		z.object({
			type: DiceTypeSchema,
			result: z.number().optional(),
			disabled: z.boolean().optional()
		})
	),
	modifier: z.number().int(),
	status: z.enum(['rolling', 'complete']),
	timestamp: z.number(),
	rollerName: z.string().optional()
});
export type Roll = z.infer<typeof RollSchema>;

export const DiceHistorySchema = z.object({
	rolls: z.array(RollSchema)
});
export type DiceHistory = z.infer<typeof DiceHistorySchema>;

export const RollInputSchema = z.object({
	name: z.string().optional(),
	dice: RollSchema.shape.dice,
	modifier: z.number().optional()
});
export type RollInput = z.infer<typeof RollInputSchema>;
