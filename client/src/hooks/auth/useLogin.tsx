import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type AuthLogin, AuthResponse } from "../../types/auth";

import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function useLogin() {
    const { login } = useAuth();
    const navigate = useNavigate({ from: "/login" });
    const { mutate } = useMutation<
        z.infer<typeof AuthResponse>,
        Error,
        AuthLogin
    >({
        mutationFn: (data) =>
            loginUser({
                body: { user: data.user, password: data.password },
            }),

        onSuccess: (data) => {
            if (data) {
                login(data.token, data.userId);
                navigate({ to: "/" });
            }
        },
        onError: (err) => console.error("mutation error: ", err),
    });

    return { mutate };
}
