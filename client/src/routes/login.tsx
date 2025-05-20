import { createFileRoute, redirect } from "@tanstack/react-router";

import LoginForm from "../components/Login/LoginForm";
import useLogin from "../hooks/auth/useLogin";

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

function Login() {
    const { mutate } = useLogin();

    return (
        <LoginForm
            onLoginSubmit={(username: string, password: string) =>
                mutate({ username, password })
            }
        />
    );
}
