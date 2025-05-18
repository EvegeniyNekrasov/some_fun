import { useQuery } from "@tanstack/react-query";
import { listTicketsByProjectId } from "../../api/tickets";

export default function useGetTicketsListByProjectId(projectId: number) {
    return useQuery({
        queryKey: ["listTicketsByCodProject", projectId],
        queryFn: () => listTicketsByProjectId({ path: { id: projectId } }),
        refetchOnWindowFocus: false,
    });
}
