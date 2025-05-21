import { z } from "zod";

export const StatusSchema = z.object({
    id: z.number(),
    name: z.string(),
    category: z.string(),
    color: z.string(),
});

export const StatusesListSchema = z.array(StatusSchema);

export type Status = z.infer<typeof StatusSchema>;
export type StatusList = z.infer<typeof StatusesListSchema>;
