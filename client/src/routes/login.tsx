import useLogin from "@/hooks/auth/useLogin";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

export const Route = createFileRoute("/login")({
    beforeLoad: ({ context, location }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: "/",
                search: { redirect: location.href },
            });
        }
    },
    component: Login,
});

type Inputs = {
    username: string;
    password: string;
};

function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const { mutate } = useLogin();

    const onSumbit: SubmitHandler<Inputs> = (data) => {
        if (data.password && data.username) {
            const { username, password } = data;
            mutate({ username, password });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSumbit)}>
            <input
                {...register("username", { required: true })}
                placeholder="username"
                type="text"
            />
            <input
                {...register("password", { required: true })}
                placeholder="password"
                type="password"
            />
            <input type="submit" />
        </form>
    );
}
