import { useQuery } from "@tanstack/react-query";
import { statusesList } from "../../api/statuses";

export default function useGetStatuses() {
    return useQuery({
        queryKey: ["statusesList"],
        queryFn: () => statusesList(),
        refetchOnWindowFocus: false,
    });
}
