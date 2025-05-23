import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

type Inputs = {
    user: string;
    username: string;
    email: string;
    password: string;
    passwordRepeat: string;
};

interface RegisterFormProps {
    onRegisterSubmit: (
        user: string,
        username: string,
        password: string,
        email: string
    ) => void;
}

export default function RegisterForm({ onRegisterSubmit }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = React.useState(false);

    const onSubmit: SubmitHandler<Inputs> = ({
        user,
        username,
        password,
        passwordRepeat,
        email,
    }) => {
        if (user && username && password && email && passwordRepeat) {
            if (password.trim() === passwordRepeat.trim()) {
                onRegisterSubmit(user, username, password, email);
            }
        }
    };

    const userId = React.useId();
    const usernameId = React.useId();
    const passwordId = React.useId();
    const passwordRepeatId = React.useId();
    const emailId = React.useId();
    const toggleId = React.useId();
    const toggleRepeatId = React.useId();

    return (
        <div className="w-full h-screen flex gap-8 p-20">
            <div className="w-full flex flex-col justify-center items-center">
                <form
                    className="flex flex-col gap-4 w-full max-w-md p-5"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate>
                    <h1 className="text-2xl text-zinc-500 mb-8 font-semibold">
                        Register
                    </h1>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={userId}
                            className="text-sm text-zinc-400">
                            User
                        </label>
                        <input
                            id={userId}
                            placeholder="johndoe"
                            className="w-full bg-transparent placeholder:text-zinc-600
                                 text-zinc-200 text-sm border border-zinc-800 
                                 rounded-md px-3 py-2 transition duration-300 ease 
                                 focus:outline-none focus:border-zinc-600
                                  hover:border-zinc-600 shadow-sm focus:shadow"
                            type="text"
                            aria-invalid={Boolean(errors.user)}
                            {...register("user", {
                                required: "User is required",
                            })}
                        />
                        {errors.user && (
                            <span
                                role="alert"
                                className="text-xs text-red-500">
                                {errors.user.message}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={usernameId}
                            className="text-sm text-zinc-400">
                            Username
                        </label>
                        <input
                            id={usernameId}
                            placeholder="johndoe"
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
                            htmlFor={emailId}
                            className="text-sm text-zinc-400">
                            Email
                        </label>
                        <input
                            id={emailId}
                            placeholder="johndoe@mail.com"
                            className="w-full bg-transparent placeholder:text-zinc-600
                                 text-zinc-200 text-sm border border-zinc-800 
                                 rounded-md px-3 py-2 transition duration-300 ease 
                                 focus:outline-none focus:border-zinc-600
                                  hover:border-zinc-600 shadow-sm focus:shadow"
                            type="text"
                            aria-invalid={Boolean(errors.email)}
                            {...register("email", {
                                required: "Username is required",
                            })}
                        />
                        {errors.email && (
                            <span
                                role="alert"
                                className="text-xs text-red-500">
                                {errors.email.message}
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

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor={passwordRepeatId}
                            className="text-sm text-zinc-400">
                            Password Repeat
                        </label>
                        <input
                            id={passwordRepeatId}
                            placeholder="********"
                            className="w-full bg-transparent placeholder:text-zinc-600
                                 text-zinc-200 text-sm border border-zinc-800 
                                 rounded-md px-3 py-2 transition duration-300 ease 
                                 focus:outline-none focus:border-zinc-600
                                  hover:border-zinc-600 shadow-sm focus:shadow"
                            type={showPasswordRepeat ? "text" : "password"}
                            aria-invalid={Boolean(errors.passwordRepeat)}
                            {...register("passwordRepeat", {
                                required: "Password is required",
                            })}
                        />
                        {errors.passwordRepeat && (
                            <span
                                role="alert"
                                className="text-xs text-red-500">
                                {errors.passwordRepeat.message}
                            </span>
                        )}
                        <div className="flex gap-2 items-center mt-1">
                            <input
                                id={toggleRepeatId}
                                type="checkbox"
                                checked={showPasswordRepeat}
                                onChange={() =>
                                    setShowPasswordRepeat((v) => !v)
                                }
                                className="accent-zinc-400 cursor-pointer"
                            />
                            <label
                                htmlFor={toggleRepeatId}
                                className="text-sm select-none">
                                {showPasswordRepeat ? "Hide" : "Show"} password
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-zinc-700 mt-6 px-4 py-2 rounded
                             hover:bg-zinc-800 disabled:opacity-50 cursor-pointer">
                        Sign in
                    </button>
                </form>

                <p className="mt-6 text-sm">
                    ¿Already have an account:{" "}
                    <Link
                        to="/login"
                        className="text-blue-400 hover:underline">
                        Signin
                    </Link>
                </p>
            </div>
            <div className="max-w-[800px] w-full rounded h-full bg-zinc-800" />
        </div>
    );
}
