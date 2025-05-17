import { queryOptions } from "@tanstack/react-query";
import { listProjects } from "../../api/projects";

export const projectsQueryOptions = queryOptions({
    queryKey: ["listProjects"],
    queryFn: () => listProjects(),
    refetchOnWindowFocus: false,
});
