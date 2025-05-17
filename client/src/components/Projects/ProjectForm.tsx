import * as React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

interface ProjectFormProps {
    onProjectSubmit: (
        key: string,
        name: string,
        owner_id: number,
        created_at: string,
        description: string | null
    ) => void;
}

type Inputs = {
    key: string;
    name: string;
    owner_id: number; // for now not used
    description: string | null;
};

export default function ProjectForm({ onProjectSubmit }: ProjectFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = ({ key, name, description }) => {
        if (key && name)
            onProjectSubmit(key, name, 1, "2025-01-01", description);
    };

    const keyId = React.useId();
    const nameId = React.useId();
    const descriptionId = React.useId();

    return (
        <form
            className="flex flex-col gap-4 w-full h-full p-2"
            onSubmit={handleSubmit(onSubmit)}
            noValidate>
            {/* KEY */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor={keyId}
                    className="text-sm text-zinc-400">
                    Key
                </label>
                <input
                    id={keyId}
                    placeholder="DEV-1"
                    className="w-full bg-transparent placeholder:text-zinc-600
                             text-zinc-200 text-sm border border-zinc-800 
                             rounded-md px-3 py-2 transition duration-300 ease 
                             focus:outline-none focus:border-zinc-600
                              hover:border-zinc-600 shadow-sm focus:shadow"
                    type="text"
                    aria-invalid={Boolean(errors.key)}
                    {...register("key", {
                        required: "Key is required",
                    })}
                />
                {errors.key && (
                    <span
                        role="alert"
                        className="text-xs text-red-500">
                        {errors.key.message}
                    </span>
                )}
            </div>

            {/* NAME */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor={nameId}
                    className="text-sm text-zinc-400">
                    NAme
                </label>
                <input
                    id={nameId}
                    placeholder="Name project"
                    className="w-full bg-transparent placeholder:text-zinc-600
                             text-zinc-200 text-sm border border-zinc-800 
                             rounded-md px-3 py-2 transition duration-300 ease 
                             focus:outline-none focus:border-zinc-600
                              hover:border-zinc-600 shadow-sm focus:shadow"
                    type="text"
                    aria-invalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required",
                    })}
                />
                {errors.name && (
                    <span
                        role="alert"
                        className="text-xs text-red-500">
                        {errors.name.message}
                    </span>
                )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor={descriptionId}
                    className="text-sm text-zinc-400">
                    Description
                </label>
                <input
                    id={descriptionId}
                    placeholder="Name project"
                    className="w-full bg-transparent placeholder:text-zinc-600
                             text-zinc-200 text-sm border border-zinc-800 
                             rounded-md px-3 py-2 transition duration-300 ease 
                             focus:outline-none focus:border-zinc-600
                              hover:border-zinc-600 shadow-sm focus:shadow"
                    type="text"
                    {...register("description")}
                />
            </div>

            <button
                type="submit"
                className="bg-zinc-700 mt-6 px-4 py-2 rounded
                         hover:bg-zinc-800 disabled:opacity-50 cursor-pointer">
                Create project
            </button>
        </form>
    );
}
