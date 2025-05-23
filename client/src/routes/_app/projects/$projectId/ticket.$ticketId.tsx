import { createFileRoute, Link } from "@tanstack/react-router";
import useGetTicketById from "@/hooks/tickets/useGetTicketById";
import useGetUsersList from "@/hooks/users/useGetUsersList";
import { useAuth } from "@/context/AuthContext";
import useGetCommentsByTicketId from "@/hooks/comments/useGetCommentsByTicketId";
import * as React from "react";
import type { Comment } from "@/types/comments";
import { Button } from "@/ui/button/Button";
import useMutateCreateComment from "@/hooks/comments/useMutateCreateComment";

export const Route = createFileRoute(
    "/_app/projects/$projectId/ticket/$ticketId"
)({
    component: RouteComponent,
});

function RouteComponent() {
    const ticketId = Route.useParams().ticketId;
    const projectId = Route.useParams().projectId;
    const { userId } = useAuth();
    const users = useGetUsersList();
    const [commentInput, setCommentInput] = React.useState("");
    const { mutate } = useMutateCreateComment();

    const isNumber = (value: string): boolean => {
        return !isNaN(Number(value.trim()));
    };

    const ticket_id = isNumber(ticketId) ? ticketId : undefined;

    const comments = useGetCommentsByTicketId(Number(ticket_id));

    const { data, isFetching, isLoading, isError } =
        useGetTicketById(+ticketId);

    if (isFetching || isLoading) return <span>Loading...</span>;
    if (isError) return <span>ooops... some error</span>;

    function getAssignedUser() {
        const findedUser = users.data?.find((u) => u.id === data?.assignee_id);
        if (!findedUser) return null;

        return findedUser.username;
    }

    function handleAddComment(): void {
        const newComment: Partial<Comment> = {
            ticket_id: Number(ticketId),
            user_id: userId ?? 0,
            message: commentInput,
        };

        mutate({ id: Number(ticketId), data: newComment });
        setCommentInput("");    
    }

    return (
        <div className="p-2 w-full flex flex-col gap-2">
            <Link
                to="/projects/$projectId"
                params={{ projectId }}>
                Go back
            </Link>

            <div className="p-4 w-full bg-zinc-600">
                <span className="text-2xl">Title: {data?.title}</span>
                <div className="p-2 bg-zinc-700">
                    <span>{data?.description}</span>
                </div>
                {data?.assignee_id ? (
                    <span>Assigned: {getAssignedUser()}</span>
                ) : null}
                <span>Priotity: {data?.priority}</span>
            </div>
            <div className="flex flex-col gap-2">
                <span>Comments</span>
                <div className="flex items-center gap-4">
                    <input
                        value={commentInput}
                        onInput={(e) =>
                            setCommentInput(
                                (e.target as HTMLInputElement).value
                            )
                        }
                        className="px-4 py-2 bg-zinc-600 w-full rounded outline-0"
                        type="text"
                        placeholder="add comment..."
                    />
                    <Button
                        className="w-[200px]"
                        onClick={handleAddComment}>
                        Add comment
                    </Button>
                </div>
                {comments.isLoading ? <div>Loading comments...</div> : null}
                {!comments.isLoading && comments.data ? (
                    <div>
                        {comments.data.length === 0 ? (
                            <div>no comments yet</div>
                        ) : null}
                        {comments.data?.length > 0 ? (
                            <ul>
                                {comments.data.map((c) => (
                                    <li key={c.id}>
                                        <div className="flex items-center justify-between">
                                            <span>{c.message}</span>
                                            <div className="flex items-center gap-2">
                                                <span>{c.created_at}</span>
                                                <span>
                                                    {
                                                        users.data?.find(
                                                            (u) =>
                                                                u.id ===
                                                                c.user_id
                                                        )?.username
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
