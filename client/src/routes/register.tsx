import { createFileRoute, redirect } from "@tanstack/react-router";
import useRegister from "../hooks/auth/useRegister";
import RegisterForm from "../components/Register/RegisterForm";

export const Route = createFileRoute("/register")({
    beforeLoad: ({ context, location }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: "/",
                search: { redirect: location.href },
            });
        }
    },
    component: Register,
});

function Register() {
    const { mutate } = useRegister();

    const handleRegisterSubmit = (
        username: string,
        password: string,
        email: string
    ) => {
        mutate({ username, password, email });
    };

    return <RegisterForm onRegisterSubmit={handleRegisterSubmit} />;
}
