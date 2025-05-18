import { useQuery } from "@tanstack/react-query";
import type { Project } from "../../types/projects";
import { getProgect } from "../../api/projects";

export default function useGetProjectById(projectId: number) {
    return useQuery<Project, Error>({
        queryKey: ["projectByProjectId", projectId],
        queryFn: () => getProgect({ path: { id: projectId } }),
        refetchOnWindowFocus: false,
    });
}
