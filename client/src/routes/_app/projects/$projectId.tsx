import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Kanban } from "lucide-react";
import type { Status } from "../../../types/statuses";
import type { Ticket, Tickets } from "../../../types/tickets";
import useMutateUpdateTicket from "../../../hooks/tickets/useMutateUpdateTicket";
import useGetTicketsListByProjectId from "../../../hooks/tickets/useGetTicketsListByProjectId";
import useGetProjectById from "../../../hooks/projects/useGetProjectById";
import useGetStatuses from "../../../hooks/statuses/useGetStatuses";
import Dialog from "../../../ui/dialog/Dialog";

export const Route = createFileRoute("/_app/projects/$projectId")({
    component: RouteComponent,
});

function RouteComponent() {
    const projectId = Route.useParams().projectId;
    const projectData = useGetProjectById(+projectId);
    const ticketListaData = useGetTicketsListByProjectId(+projectId);
    const statusesData = useGetStatuses();
    const [open, setOpen] = React.useState(false);
    const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
        null
    );
    const [ticketList, setTicketList] = React.useState<Ticket[] | null>(null);
    const [filteredTicketList, setFilteredTicketList] = React.useState<
        Ticket[] | null
    >(null);
    const [inputText, setInputText] = React.useState<string>("");

    const { mutate } = useMutateUpdateTicket();

    React.useEffect(() => {
        if (ticketListaData.data) {
            setTicketList(ticketListaData.data);
            setFilteredTicketList(ticketListaData.data);
        }
    }, [ticketListaData.data]);

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

    function filterTickets(value: string): void {
        setInputText(value);
        const copyList = ticketList;
        if (copyList) {
            const filteredList = copyList?.filter((item) =>
                item.title
                    .toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase())
            );

            setFilteredTicketList(filteredList);
        }
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
            if (ticket) {
                const updated = { ...ticket, status_id: +toStatusId };
                mutate({
                    id: ticketId,
                    projectId: +projectId,
                    data: updated,
                });
            }
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

    function handleOpenTicket(id: number) {
        const findedTicket = ticketListaData?.data?.find(
            (ticket) => ticket.id === id
        );

        if (findedTicket) {
            console.log(findedTicket);
            setSelectedTicket(findedTicket);
            setOpen(true);
        }
    }

    return (
        <div className="p-4 flex flex-col gap-2 w-full h-full">
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
            <input
                type="text"
                placeholder="search for ticket..."
                value={inputText}
                className="w-full h-8 p-2 bg-zinc-700"
                onChange={(e) => filterTickets(e.target.value)}
            />

            {statusesData.data && filteredTicketList ? (
                <div className="flex w-full h-full justify-between gap-4">
                    {statusesData?.data?.map((status) => {
                        const filteredTickets = filteredTicketList?.filter(
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
                                handleOpenTicket={handleOpenTicket}
                            />
                        );
                    })}
                </div>
            ) : null}

            <Dialog
                onClose={() => setOpen(false)}
                size="xxl"
                title={{ type: "link", text: selectedTicket?.title ?? "" }}
                open={open}>
                <div className="flex flex-col gap-2">
                    <span>{selectedTicket?.priority}</span>
                    <span>{selectedTicket?.title}</span>
                </div>
            </Dialog>
        </div>
    );
}

function KanbanColumn({
    column,
    tickets,
    onDragOver,
    onDrop,
    onDragStart,
    handleOpenTicket,
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
    handleOpenTicket: (id: number) => void;
}) {
    return (
        <div
            key={column.id}
            className="bg-zinc-600 w-full h-fit p-4 rounded-sm select-none cursor-grab active:cursor-grabbing 
                        transition-transform"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}>
            <div className="flex items-center justify-between">
                <span>{column.name}</span>
                <span>{tickets.length}</span>
            </div>
            <div className="flex flex-col gap-2">
                {tickets.map((ticket) => (
                    <div
                        key={ticket.id}
                        draggable
                        onClick={() => handleOpenTicket(ticket.id)}
                        onDragStart={(e) =>
                            onDragStart(e, ticket.id, column.id)
                        }
                        className="p-4 bg-zinc-400 flex flex-col gap-2">
                        <span>Title: {ticket.title}</span>
                        <span>Priority: {ticket.priority}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
