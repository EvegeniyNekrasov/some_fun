import { useQuery } from "@tanstack/react-query";
import { tiketById } from "../../api/tickets";

export default function useGetTicketById(id: number) {
    return useQuery({
        queryKey: ["ticketById", id],
        queryFn: () => tiketById({ path: { id } }),
        enabled: id !== undefined || id !== null,
    });
}
