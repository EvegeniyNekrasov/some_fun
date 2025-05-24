import "dayjs/locale/en";

import * as helpers from "@/utils/helpers";

import type { Comment } from "@/types/comments";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.locale("en");

interface CommentCponentProps {
    comment: Comment;
    username: string;
}

export default function CommentComponent({
    comment,
    username,
}: CommentCponentProps) {
    if (!comment) return null;
    return (
        <div className="flex gap-2 flex-start">
            <div
                className="w-[50px] h-[50px] flex items-center justify-center
                            rounded-full bg-zinc-900 text-white">
                <span className="text-sm">
                    {helpers.makeAbbreviation(username)}
                </span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{username}</span>
                    <span className="text-sm">
                        {dayjs(comment.created_at).fromNow()}
                    </span>
                </div>
                <span>{comment.message}</span>
            </div>
        </div>
    );
}
