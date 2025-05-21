import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Ticket } from "../../types/tickets";
import { createTicket } from "../../api/tickets";

type CreateVars = {
    project_id: number;
    data: Ticket;
};

export default function useMutateCreateTicket() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation<Ticket, Error, CreateVars>({
        mutationFn: ({ data }) => createTicket({ body: data }),
        onSuccess: (_, { project_id }) =>
            queryClient.invalidateQueries({
                queryKey: ["listTicketsByCodProject", project_id],
            }),
    });

    return { mutate };
}
