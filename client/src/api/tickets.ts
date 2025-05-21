import { TicketSchema, TicketsListSchema, type Ticket } from "../types/tickets";
import { makeEndpoint } from "../utils/http";

export const listTicketsByProjectId = makeEndpoint<
    typeof TicketsListSchema,
    { id: number }
>({
    method: "get",
    path: ({ id }) => `/api/projects/${id}/tickets`,
    response: TicketsListSchema,
});

export const updateTicket = makeEndpoint<
    typeof TicketSchema,
    { id: number },
    void,
    Ticket
>({
    method: "put",
    path: (p) => `/api/tickets/${p.id}`,
    response: TicketSchema,
});

export const tiketById = makeEndpoint<
    typeof TicketSchema,
    { id: number },
    void,
    void
>({
    method: "get",
    path: (p) => `/api/tickets/${p.id}`,
    response: TicketSchema,
});

export const createTicket = makeEndpoint<
    typeof TicketSchema,
    void,
    void,
    Ticket
>({
    method: "post",
    path: () => `/api/tickets`,
    response: TicketSchema,
});
