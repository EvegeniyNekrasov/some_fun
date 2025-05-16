import { registerUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AuthRegister, AuthResponse } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";

export default function useRegister() {
    const auth = useAuth();
    const navigate = useNavigate({ from: "/register" });

    const { mutate } = useMutation<AuthResponse, Error, AuthRegister>({
        mutationFn: ({ username, password, email }) =>
            registerUser({ username, password, email }),
        onSuccess: (data) => {
            auth.login(data.token);
            navigate({ to: "/" });
        },
        onError: (err) => console.error("mutation error: ", err),
    });

    return { mutate };
}
