import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { projectsQueryOptions } from "../../../hooks/projects/useGetProjects";
import { useSuspenseQuery } from "@tanstack/react-query";
import SlideOver from "../../../components/SlideOver/SlideOver";
import ProjectForm from "../../../components/Projects/ProjectForm";

export const Route = createFileRoute("/_app/projects/")({
    component: RouteComponent,
});

function RouteComponent() {
    const projectsQuery = useSuspenseQuery(projectsQueryOptions);
    const [open, isOpen] = React.useState<boolean>(false);

    const handleCreateProject = () => isOpen(true);

    const handleProjectSubmit = (
        key: string,
        name: string,
        owner_id: number,
        created_at: string,
        description: string | null
    ) => {
        console.log(`${key} ${name} ${owner_id} ${created_at} ${description}`);
    };

    return (
        <div>
            <span>Projects page</span>
            <div className="flex flex-wrap items-center gap-2">
                {!projectsQuery.isFetching &&
                projectsQuery.data.length === 0 ? (
                    <span>You dont have created projects yet</span>
                ) : null}
            </div>
            <button onClick={handleCreateProject}>Create project</button>
            <SlideOver
                open={open}
                toggle={isOpen}>
                <ProjectForm onProjectSubmit={handleProjectSubmit} />
            </SlideOver>
        </div>
    );
}
