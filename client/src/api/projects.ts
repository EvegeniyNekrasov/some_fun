import {
    ProjectsSchema,
    type CreatedProject,
    ProjectSchema,
} from "../types/projects";

import { makeEndpoint } from "../utils/http";

export const listProjects = makeEndpoint<typeof ProjectsSchema, void>({
    method: "get",
    path: "/api/projects",
    response: ProjectsSchema,
});

export const makeProject = makeEndpoint<typeof ProjectSchema, CreatedProject>({
    method: "post",
    path: "/api/projects",
    response: ProjectSchema,
});
