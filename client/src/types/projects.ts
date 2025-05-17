import { z } from "zod";

export const ProjectSchema = z.object({
    id: z.number(),
    key: z.string(),
    name: z.string(),
    description: z.string(),
    owner_id: z.number(),
    created_at: z.date(),
});

export const CreateProjectSchema = z.object({
    id: z.number(),
});

export const ProjectsSchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;
export type Projects = z.infer<typeof ProjectsSchema>;
export type CreatedProject = z.infer<typeof CreateProjectSchema>;
