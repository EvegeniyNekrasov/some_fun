import { listCommentByTicketId } from "@/api/comments";
import { QUERY_KEY_COMMENT_LIST } from "@/types/comments";
import { useQuery } from "@tanstack/react-query";

export default function useGetCommentsByTicketId(id: number) {
    return useQuery({
        queryKey: [QUERY_KEY_COMMENT_LIST.getListByTicketId, id],
        queryFn: () => listCommentByTicketId({ path: { id } }),
        enabled: id !== null || id !== undefined,
        refetchOnWindowFocus: false,
    });
}
