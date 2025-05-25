import * as helpers from "@/utils/helpers";
import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

import Breadcrumbs from "@/components/Breadcrumbs";
import type { Comment } from "@/types/comments";
import CommentForm from "@/components/Forms/CommentForm";
import CommentList from "@/components/Comments/CommentsList";
import useGetCommentsByTicketId from "@/hooks/comments/useGetCommentsByTicketId";

import useGetTicketById from "@/hooks/tickets/useGetTicketById";
import useGetUsersList from "@/hooks/users/useGetUsersList";
import useMutateCreateComment from "@/hooks/comments/useMutateCreateComment";

import Select from "@/ui/select/Select";

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
    const { data, isFetching, isLoading, isError } =
        useGetTicketById(+ticketId);

    const [priority, setPriority] = React.useState<
        (typeof helpers.priorityList)[number]["value"] | ""
    >("");

    React.useEffect(() => {
        if (data) setPriority(data.priority);
    }, [data]);

    const crumbs = [
        { to: "/projects", label: "Projects" },
        {
            to: "/projects/$projectId",
            params: { projectId: projectId },
            label: `Project ${projectId}`,
        },
        {
            to: "/projects/$projectId/ticket/$ticketId",
            params: { projectId: projectId, ticketId: ticketId },
            label: `Ticket #${ticketId}`,
        },
    ];

    const isNumber = (value: string): boolean => {
        return !isNaN(Number(value.trim()));
    };

    const ticket_id = isNumber(ticketId) ? ticketId : undefined;

    const comments = useGetCommentsByTicketId(Number(ticket_id));

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
        <div className="page w-full flex flex-col gap-2">
            <Breadcrumbs items={crumbs} />

            <span className="text-2xl">Title: {data?.title}</span>
            <div className="p-2 bg-zinc-700">
                <span>{data?.description}</span>
            </div>
            {data?.assignee_id ? (
                <span>Assigned: {getAssignedUser()}</span>
            ) : null}

            <Select
                title="Ticket priority"
                value={priority}
                options={helpers.priorityList}
                onChange={setPriority}
                className="w-[300px]"
            />

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
