import { createFileRoute, Link } from "@tanstack/react-router";
import useGetTicketById from "../../../../hooks/tickets/useGetTicketById";
import useGetUsersList from "../../../../hooks/users/useGetUsersList";

export const Route = createFileRoute(
    "/_app/projects/$projectId/ticket/$ticketId"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const ticketId = Route.useParams().ticketId;
    const projectId = Route.useParams().projectId;
    const users = useGetUsersList();
    const { data, isFetching, isLoading, isError } =
        useGetTicketById(+ticketId);

    if (isFetching || isLoading) return <span>Loading...</span>;
    if (isError) return <span>ooops... some error</span>;

    function getAssignedUser() {
        const findedUser = users.data?.find((u) => u.id === data?.assignee_id);
        if (!findedUser) return null;

        return findedUser.username;
    }

    return (
        <div className="p-2 flex flex-col gap-2">
            <Link to={`/projects/${projectId}`}>Go back</Link>
            <span className="text-2xl">Titule: {data?.title}</span>
            <div className="p-2 bg-zinc-700">
                <span>{data?.description}</span>
            </div>
            {data?.assignee_id ? (
                <span>Assigned: {getAssignedUser()}</span>
            ) : null}
            <span>Priotity: {data?.priority}</span>
        </div>
    );
}
