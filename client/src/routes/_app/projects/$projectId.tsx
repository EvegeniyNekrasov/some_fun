import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Kanban } from "lucide-react";
import type { Status } from "../../../types/statuses";
import type { Tickets } from "../../../types/tickets";
import useMutateUpdateTicket from "../../../hooks/tickets/useMutateUpdateTicket";
import useGetTicketsListByProjectId from "../../../hooks/tickets/useGetTicketsListByProjectId";
import useGetProjectById from "../../../hooks/projects/useGetProjectById";
import useGetStatuses from "../../../hooks/statuses/useGetStatuses";

export const Route = createFileRoute("/_app/projects/$projectId")({
    component: RouteComponent,
});

function RouteComponent() {
    const projectId = Route.useParams().projectId;
    const projectData = useGetProjectById(+projectId);
    const ticketListaData = useGetTicketsListByProjectId(+projectId);
    const statusesData = useGetStatuses();

    const { mutate } = useMutateUpdateTicket();
    function onDragStart(
        e: React.DragEvent<HTMLDivElement>,
        ticketId: number,
        fromStatusId: number
    ) {
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ ticketId, fromStatusId })
        );
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    async function onDrop(
        e: React.DragEvent<HTMLDivElement>,
        toStatusId: number
    ) {
        e.preventDefault();
        const raw = e.dataTransfer.getData("application/json");
        if (!raw) return;

        const { ticketId, fromStatusId } = JSON.parse(raw) as {
            ticketId: number;
            fromStatusId: number;
        };

        if (fromStatusId === toStatusId) return;
        if (ticketListaData.data) {
            const ticket = ticketListaData.data?.find((t) => t.id === ticketId);
            if (ticket) ticket.status_id = +toStatusId;
            mutate({
                id: ticketId,
                projectId: +projectId,
                data: ticket,
            });
        }
    }

    if (
        projectData.isLoading ||
        ticketListaData.isLoading ||
        statusesData.isLoading
    ) {
        return <span>Skeleton kanban</span>;
    }

    if (
        projectData.isError ||
        ticketListaData.isError ||
        statusesData.isError
    ) {
        return <span>Error while loading data</span>;
    }

    return (
        <div className="p-4 w-full h-full">
            {projectData.data ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Kanban />
                        <span className="text-2xl">
                            {projectData.data?.name}
                        </span>
                    </div>
                    <span>{projectData.data?.description}</span>
                </div>
            ) : null}
            {statusesData.data && ticketListaData.data ? (
                <div className="flex items-center w-full h-full justify-between gap-4">
                    {statusesData?.data?.map((status) => {
                        const filteredTickets = ticketListaData?.data?.filter(
                            (ticket) => ticket.status_id === status.id
                        );
                        return (
                            <KanbanColumn
                                key={status.id}
                                column={status}
                                tickets={filteredTickets || []}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                onDragStart={onDragStart}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

function KanbanColumn({
    column,
    tickets,
    onDragOver,
    onDrop,
    onDragStart,
}: {
    column: Status;
    tickets: Tickets;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, toStatusId: number) => void;
    onDragStart: (
        e: React.DragEvent<HTMLDivElement>,
        ticketId: number,
        fromStatusId: number
    ) => void;
}) {
    return (
        <div
            key={column.id}
            className="bg-zinc-600 w-full h-full p-2 rounded-sm select-none cursor-grab active:cursor-grabbing 
                        transition-transform"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}>
            <span>{column.name}</span>
            <div>
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        draggable
                        onDragStart={(e) =>
                            onDragStart(e, ticket.id, column.id)
                        }
                        className="p-2 bg-zinc-400 flex flex-col gap-2">
                        <span>Title: {ticket.title}</span>
                        <span>Priority: {ticket.priority}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
