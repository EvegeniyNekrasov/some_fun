import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Ticket } from "../../types/tickets";
import { updateTicket } from "../../api/tickets";

type UpdateVars = {
    id: number;
    project_id: number;
    data: Ticket;
};



export default function useMutateUpdateTicket() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation<Ticket, Error, UpdateVars>({
        mutationFn: ({ id, data }) =>
            updateTicket({ path: { id }, body: data }),

        onSuccess: (updated, { project_id }) => {
            queryClient.setQueryData<Ticket[]>(
                ["listTicketsByCodProject", project_id],
                (old) =>
                    old
                        ? old.map((t) => (t.id === updated.id ? updated : t))
                        : []
            );
            queryClient.invalidateQueries({
                queryKey: ["listTicketsByCodProject", project_id],
            });
        },
    });

    return { mutate };
}
