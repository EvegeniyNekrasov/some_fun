import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

interface LoginFormProps {
    onLoginSubmit: (username: string, password: string) => void;
}

type Inputs = {
    username: string;
    password: string;
};

export default function LoginForm({ onLoginSubmit }: LoginFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit: SubmitHandler<Inputs> = ({ username, password }) => {
        if (username && password) onLoginSubmit(username, password);
    };

    const usernameId = React.useId();
    const passwordId = React.useId();
    const toggleId = React.useId();

    return (
        <div className="w-full h-screen flex gap-8 p-20">
            <div className="w-full flex flex-col justify-center items-center">
                <form
                    className="flex flex-col gap-4 w-full max-w-md p-5"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate>
                    <h1 className="text-2xl text-zinc-500 mb-8 font-semibold">
                        Sign In
                    </h1>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={usernameId}
                            className="text-sm text-zinc-400">
                            Username
                        </label>
                        <input
                            id={usernameId}
                            placeholder="johndoe@mail.com"
                            className="w-full bg-transparent placeholder:text-zinc-600
                             text-zinc-200 text-sm border border-zinc-800 
                             rounded-md px-3 py-2 transition duration-300 ease 
                             focus:outline-none focus:border-zinc-600
                              hover:border-zinc-600 shadow-sm focus:shadow"
                            type="text"
                            aria-invalid={Boolean(errors.username)}
                            {...register("username", {
                                required: "Username is required",
                            })}
                        />
                        {errors.username && (
                            <span
                                role="alert"
                                className="text-xs text-red-500">
                                {errors.username.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={passwordId}
                            className="text-sm text-zinc-400">
                            Password
                        </label>
                        <input
                            id={passwordId}
                            placeholder="********"
                            className="w-full bg-transparent placeholder:text-zinc-600
                             text-zinc-200 text-sm border border-zinc-800 
                             rounded-md px-3 py-2 transition duration-300 ease 
                             focus:outline-none focus:border-zinc-600
                              hover:border-zinc-600 shadow-sm focus:shadow"
                            type={showPassword ? "text" : "password"}
                            aria-invalid={Boolean(errors.password)}
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        {errors.password && (
                            <span
                                role="alert"
                                className="text-xs text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                        <div className="flex gap-2 items-center mt-1">
                            <input
                                id={toggleId}
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword((v) => !v)}
                                className="accent-zinc-400 cursor-pointer"
                            />
                            <label
                                htmlFor={toggleId}
                                className="text-sm select-none">
                                {showPassword ? "Hide" : "Show"} password
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-zinc-700 mt-6 px-4 py-2 rounded
                         hover:bg-zinc-800 disabled:opacity-50 cursor-pointer">
                        Signin
                    </button>
                </form>

                <p className="mt-6 text-sm">
                    ¿Don't have an account:{" "}
                    <Link
                        to="/register"
                        className="text-blue-400 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
            <div className="max-w-[800px] w-full rounded h-full bg-zinc-800" />
        </div>
    );
}
