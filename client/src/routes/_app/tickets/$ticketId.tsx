import { createFileRoute } from "@tanstack/react-router";
import useGetTicketById from "../../../hooks/tickets/useGetTicketById";
import useGetUsersList from "../../../hooks/users/useGetUsersList";

export const Route = createFileRoute("/_app/tickets/$ticketId")({
    component: RouteComponent,
});

function RouteComponent() {
    const ticketId = Route.useParams().ticketId;
    const users = useGetUsersList();
    console.log(users.data);
    const { data, isFetching, isLoading, isError } =
        useGetTicketById(+ticketId);

    if (isFetching || isLoading) return <span>Loading...</span>;
    if (isError) return <span>ooops... some error</span>;

    console.log(data);

    return <div>Pagina del ticket: {ticketId}</div>;
}
