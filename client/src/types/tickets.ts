import { z } from "zod";

export const TicketSchema = z.object({
    id: z.number(),
    project_id: z.number(),
    type_id: z.number(),
    title: z.string(),
    description: z.string().nullable(),
    status_id: z.number(),
    priority: z.string(),
    user_id: z.number(),
    assignee_id: z.number().nullable(),
    story_points: z.number().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const TicketsListSchema = z.array(TicketSchema);

export type Ticket = z.infer<typeof TicketSchema>;
export type Tickets = z.infer<typeof TicketsListSchema>;
