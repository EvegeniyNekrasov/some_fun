import { z } from "zod";

export const CommentSchema = z.object({
    id: z.number(),
    ticket_id: z.number(),
    user_id: z.number(),
    message: z.string(),
    created_at: z.string(),
});

export const CommentListSchema = z.array(CommentSchema);

export type Comment = z.infer<typeof CommentSchema>;
export type Comments = z.infer<typeof CommentListSchema>;

export const QUERY_KEY_COMMENT_LIST = {
    /**
     * List of comments by ticket id
     */
    getListByTicketId: "listCommentByTicketId",
    /**
     * Set new comment
     */
    setComment: "setComment",
};
