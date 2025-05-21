import { useQuery } from "@tanstack/react-query";
import { listUsers } from "../../api/users";

export default function useGetUsersList() {
    return useQuery({
        queryKey: ["users-list"],
        queryFn: () => listUsers(),
        refetchOnWindowFocus: false,
    });
}
