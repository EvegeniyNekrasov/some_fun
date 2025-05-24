import { Link, createFileRoute } from "@tanstack/react-router";

import type { Comment } from "@/types/comments";
import CommentForm from "@/components/Forms/CommentForm";
import CommentList from "@/components/Comments/CommentsList";
import GoBackButton from "@/ui/button/GoBackButton";
import { useAuth } from "@/context/AuthContext";
import useGetCommentsByTicketId from "@/hooks/comments/useGetCommentsByTicketId";
import useGetTicketById from "@/hooks/tickets/useGetTicketById";
import useGetUsersList from "@/hooks/users/useGetUsersList";
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

    function onCommentSubmit(comment: string) {
        const newComment: Partial<Comment> = {
            ticket_id: Number(ticketId),
            user_id: userId ?? 0,
            message: comment,
        };

        mutate({ id: Number(ticketId), data: newComment });
    }

    return (
        <div className="p-2 w-full flex flex-col gap-2">
            <GoBackButton
                linkOptions={{
                    to: "/projects/$projectId",
                    params: { projectId },
                }}
            />

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
                <CommentForm onCommentSubmit={onCommentSubmit} />
                {comments.isLoading ? <div>Loading comments...</div> : null}
                {!comments.isLoading && comments.data ? (
                    <div>
                        {comments.data.length === 0 ? (
                            <div>no comments yet</div>
                        ) : null}
                        <CommentList
                            comments={comments.data}
                            usersList={users.data}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
