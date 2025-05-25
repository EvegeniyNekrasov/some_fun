import * as React from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/ui/button/Button";
import ProjectForm from "@/components/Projects/ProjectForm";
import SlideOver from "@/components/SlideOver/SlideOver";
import { projectsQueryOptions } from "@/hooks/projects/useGetProjects";
import useMutateCreateProject from "@/hooks/projects/useMutateCreateProject";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/projects/")({
    component: RouteComponent,
});

function RouteComponent() {
    const projectsQuery = useSuspenseQuery(projectsQueryOptions);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const { mutate } = useMutateCreateProject();

    const crumbs = [
        {
            to: "/projects",
            label: `Projects`,
        },
    ];

    const navigate = useNavigate({ from: "/projects" });

    const handleCreateProject = () => setIsOpen(true);

    const handleProjectSubmit = (
        key: string,
        name: string,
        owner_id: number,
        created_at: string,
        description: string | null
    ) => {
        mutate({ key, name, owner_id, description });
        setIsOpen(false);
        console.log(`${key} ${name} ${owner_id} ${created_at} ${description}`);
    };

    function handleGoTo(id: number): void {
        navigate({ to: `/projects/${id}` });
    }

    return (
        <div className="page flex flex-col gap-4">
            <Breadcrumbs items={crumbs} />
            <div className="flex items-center justify-between">
                <span>Header project page</span>
                <Button
                    variant={"primary"}
                    onClick={handleCreateProject}>
                    Create project
                </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {!projectsQuery.isFetching &&
                projectsQuery.data.length === 0 ? (
                    <span>You dont have created projects yet</span>
                ) : null}
                {!projectsQuery.isFetching && projectsQuery.data.length > 0 ? (
                    <div className="flex items-start gap-2">
                        {projectsQuery.data.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-2 p-5 min-w-[150px] h-full max-w-[220px] w-full bg-zinc-700">
                                <Button
                                    variant={"primary"}
                                    size={"sm"}
                                    onClick={() => handleGoTo(item.id)}>
                                    {item.key}
                                </Button>
                                {/* <span>{item.key}</span> */}
                                <span>{item.name}</span>
                                <span>{item.description}</span>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            <SlideOver
                open={isOpen}
                toggle={setIsOpen}>
                <ProjectForm onProjectSubmit={handleProjectSubmit} />
            </SlideOver>
        </div>
    );
}
