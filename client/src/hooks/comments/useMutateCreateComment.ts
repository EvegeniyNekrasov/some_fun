import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEY_COMMENT_LIST } from "@/types/comments";
import { createComment } from "@/api/comments";

type CreateVars = {
    id: number;
    data: Partial<Comment>;
};

export default function useMutateCreateComment() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation<Comment, Error, CreateVars>({
        mutationFn: ({ id, data }) =>
            createComment({ path: { id }, body: data }),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY_COMMENT_LIST.getListByTicketId, id],
            });
        },
    });

    return { mutate };
}
