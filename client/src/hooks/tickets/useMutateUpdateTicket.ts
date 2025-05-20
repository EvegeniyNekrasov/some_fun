import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Ticket } from "../../types/tickets";
import { updateTicket } from "../../api/tickets";

type UpdateVars = {
    id: number;
    projectId: number;
    data: Ticket;
};

export default function useMutateUpdateTicket() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation<Ticket, Error, UpdateVars>({
        mutationFn: ({ id, data }) =>
            updateTicket({ path: { id }, body: data }),

        onSuccess: (updated, { projectId }) => {
            queryClient.setQueryData<Ticket[]>(
                ["listTicketsByCodProject", projectId],
                (old) =>
                    old
                        ? old.map((t) => (t.id === updated.id ? updated : t))
                        : []
            );
            queryClient.invalidateQueries({
                queryKey: ["listTicketsByCodProject", projectId],
            });
        },
    });

    return { mutate };
}
