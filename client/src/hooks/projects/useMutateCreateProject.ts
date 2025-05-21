import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProjectSchema, type CreatedProject } from "../../types/projects";
import { makeProject } from "../../api/projects";

export default function useMutateCreateProject() {
    const queryClient = useQueryClient();
    const { mutate } = useMutation<
        typeof CreateProjectSchema,
        Error,
        CreatedProject
    >({
        mutationFn: ({ key, name, description, owner_id }) =>
            makeProject({
                body: { key, name, description: description ?? "", owner_id },
            }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["listProjects"] }),
    });

    return { mutate };
}
