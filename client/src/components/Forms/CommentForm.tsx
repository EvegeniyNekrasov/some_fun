import { Button } from "@/ui/button/Button";
import { useForm, type SubmitHandler } from "react-hook-form";

interface CommentFormProps {
    onCommentSubmit: (comment: string) => void;
}

type Inputs = { comment: string };

export default function CommentForm({ onCommentSubmit }: CommentFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = ({ comment }) => {
        if (comment) onCommentSubmit(comment);
    };

    return (
        <form
            className="w-full flex flex-col gap-2"
            noValidate
            onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-4 justify-between">
                <input
                    placeholder="add comment..."
                    className="w-full bg-zinc-700 placeholder:text-zinc-600
                        text-zinc-200 text-sm border border-zinc-800 
                        rounded-md px-3 py-2 transition duration-300 ease 
                        focus:outline-none focus:border-zinc-600
                        hover:border-zinc-600 shadow-sm focus:shadow"
                    type="text"
                    aria-invalid={Boolean(errors.comment)}
                    {...register("comment", {
                        required: "Comment is required",
                    })}
                />
                <Button
                    className="w-[200px]"
                    type="submit"
                    variant={"outline"}>
                    Add comment
                </Button>
            </div>
            {errors.comment ? (
                <span className="text-sm text-red-500">
                    {errors.comment.message}
                </span>
            ) : null}
        </form>
    );
}
