import LoginForm from "@/components/Login/LoginForm";
import useLogin from "@/hooks/auth/useLogin";
import { createFileRoute, redirect } from "@tanstack/react-router";

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

    const handleLoginSubmit = (username: string, password: string) => {
        mutate({ username, password });
    };

    return <LoginForm onLoginSubmit={handleLoginSubmit} />;
}
