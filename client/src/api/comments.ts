import {
    // CommentSchema,
    CommentListSchema,
    CommentSchema,
    type Comment,
    // Commnet,
    // Commnets,
} from "@/types/comments";

import { makeEndpoint } from "@/utils/http";
// /api/tickets/:id/comments

export const listCommentByTicketId = makeEndpoint<
    typeof CommentListSchema,
    { id: number }
>({
    method: "get",
    path: ({ id }) => `/api/tickets/${id}/comments`,
    response: CommentListSchema,
});

export const createComment = makeEndpoint<
    typeof CommentSchema,
    { id: number },
    void,
    Partial<Comment>
>({
    method: "post",
    path: ({ id }) => `/api/tickets/${id}/comments`,
    response: CommentSchema,
});
