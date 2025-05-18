import {
    ProjectsSchema,
    CreateProjectSchema,
    type Project,
} from "../types/projects";

import { makeEndpoint } from "../utils/http";

export const listProjects = makeEndpoint<typeof ProjectsSchema, void>({
    method: "get",
    path: "/api/projects",
    response: ProjectsSchema,
});

export const makeProject = makeEndpoint<typeof CreateProjectSchema, Project>({
    method: "post",
    path: "/api/projects",
    response: CreateProjectSchema,
});
