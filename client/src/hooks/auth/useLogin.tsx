import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type AuthLogin, AuthResponse } from "../../types/auth";

import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function useLogin() {
    const auth = useAuth();
    const navigate = useNavigate({ from: "/login" });

    const { mutate } = useMutation<typeof AuthResponse, Error, AuthLogin>({
        mutationFn: ({ username, password }) =>
            loginUser({ username, password }),
        onSuccess: (data) => {
            auth.login(data.token);
            navigate({ to: "/" });
        },
        onError: (err) => console.error("mutation error: ", err),
    });

    return { mutate };
}
