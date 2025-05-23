import type { Comment } from "@/types/comments";
import CommentComponent from "@/components/Comments/CommentComponent";
import type { Users } from "@/types/users";

interface CommentListProps {
    comments: Comment[] | undefined;
    usersList: Users | undefined;
}

export default function CommentList({ comments, usersList }: CommentListProps) {
    if (comments?.length === 0) return null;
    const orederedDescList = [...(comments || [])].sort((a, b) => b.id - a.id);

    return (
        <ul className="flex flex-col gap-6">
            {orederedDescList?.map((c) => {
                const userName = usersList?.find(
                    (u) => u.id === c.user_id
                )?.username;

                return (
                    <li key={c.id}>
                        <CommentComponent
                            comment={c}
                            username={userName ?? ""}
                        />
                    </li>
                );
            })}
        </ul>
    );
}
