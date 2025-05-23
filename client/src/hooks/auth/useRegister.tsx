import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuth } from "../../context/AuthContext";
import { type AuthResponse, type AuthRegister } from "../../types/auth";
import { registerUser } from "../../api/auth";

export default function useRegister() {
    const { login } = useAuth();
    const navigate = useNavigate({ from: "/register" });

    const { mutate } = useMutation<
        z.infer<typeof AuthResponse>,
        Error,
        AuthRegister
    >({
        mutationFn: (data) =>
            registerUser({
                body: {
                    username: data.username,
                    password: data.password,
                    email: data.email,
                },
            }),
        onSuccess: (data) => {
            login(data.token, data.userId);
            navigate({ to: "/" });
        },
        onError: (err) => console.error("mutation error: ", err),
    });

    return { mutate };
}
