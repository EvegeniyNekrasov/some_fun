import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/tickets/$ticketId")({
    component: RouteComponent,
});

function RouteComponent() {
    const ticketId = Route.useParams().ticketId;
    return <div>Pagina del ticket: {ticketId}</div>;
}
