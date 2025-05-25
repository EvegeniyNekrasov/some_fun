import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { Users } from "../../types/users";
import { Button } from "../../ui/button/Button";
import * as helpersUtils from "../../utils/helpers";

type TicketCreate = {
    title: string;
    description: string;
    status_id: number;
    priority: string;
    user_id: number;
    assignee_id: number | null;
    story_points: number | null;
};

interface TicketFormProps {
    onTicketCreate: (ticket: TicketCreate) => void;
    usersList: Users;
    currentUserId: number;
}

type Inputs = Omit<TicketCreate, "user_id">;

export default function TicketForm({
    onTicketCreate,
    usersList,
    currentUserId,
}: TicketFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            title: "",
            description: "",
            status_id: 1, // “To Do”
            priority: "medium",
            assignee_id: null,
            story_points: null,
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        onTicketCreate({
            ...data,
            user_id: currentUserId,
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full h-full p-2">
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="title"
                    className="text-sm text-zinc-400">
                    Title
                </label>
                <input
                    id="title"
                    placeholder="Title..."
                    className="w-full bg-transparent placeholder:text-zinc-600 text-zinc-200
                     text-sm border border-zinc-800 rounded-md px-3 py-2
                     focus:outline-none focus:border-zinc-600
                     hover:border-zinc-600 shadow-sm focus:shadow"
                    aria-invalid={Boolean(errors.title)}
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                    <span className="text-xs text-red-400">
                        {errors.title.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label
                    htmlFor="description"
                    className="text-sm text-zinc-400">
                    Description
                </label>
                <textarea
                    id="description"
                    rows={4}
                    className="w-full bg-transparent placeholder:text-zinc-600 text-zinc-200
                     text-sm border border-zinc-800 rounded-md px-3 py-2
                     focus:outline-none focus:border-zinc-600
                     hover:border-zinc-600 shadow-sm focus:shadow"
                    {...register("description")}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label
                    htmlFor={"status_id"}
                    className="text-sm text-zinc-400">
                    Status
                </label>

                <select
                    id={"status_id"}
                    className="w-full bg-transparent text-zinc-200 text-sm border border-zinc-800
                        rounded-md px-3 py-2 transition duration-300 ease
                        focus:outline-none focus:border-zinc-600 hover:border-zinc-600
                        placeholder:text-zinc-600 shadow-sm focus:shadow"
                    aria-invalid={Boolean(errors.status_id)}
                    defaultValue=""
                    {...register("status_id", {
                        required: "Status is required",
                        valueAsNumber: true,
                    })}>
                    <option
                        value=""
                        disabled>
                        Ticket status
                    </option>
                    {helpersUtils.statusList.map(({ value, label }) => (
                        <option
                            key={value}
                            value={value}>
                            {label}
                        </option>
                    ))}
                </select>

                {errors.status_id && (
                    <span className="text-xs text-red-400">
                        {errors.status_id.message as string}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label
                    htmlFor="priority"
                    className="text-sm text-zinc-400">
                    Priority
                </label>
                <select
                    id="priority"
                    className="bg-transparent text-zinc-200 text-sm border border-zinc-800
                     rounded-md px-3 py-2 focus:outline-none focus:border-zinc-600"
                    {...register("priority")}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label
                    htmlFor="assignee"
                    className="text-sm text-zinc-400">
                    Assignee
                </label>
                <select
                    id="assignee"
                    className="bg-transparent text-zinc-200 text-sm border border-zinc-800
                     rounded-md px-3 py-2 focus:outline-none focus:border-zinc-600"
                    {...register("assignee_id", { valueAsNumber: true })}>
                    <option value="">-- Unassigned --</option>
                    {usersList.map((u) => (
                        <option
                            key={u.id}
                            value={u.id}>
                            {u.username}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label
                    htmlFor="story_points"
                    className="text-sm text-zinc-400">
                    Story&nbsp;Points
                </label>
                <input
                    id="story_points"
                    type="number"
                    step="0.5"
                    min="0"
                    className="bg-transparent text-zinc-200 text-sm border border-zinc-800
                     rounded-md px-3 py-2 focus:outline-none focus:border-zinc-600"
                    {...register("story_points", { valueAsNumber: true })}
                />
            </div>

            <Button
                type="submit"
                className="w-full">
                Create ticket
            </Button>
        </form>
    );
}
