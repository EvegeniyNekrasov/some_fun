import { makeEndpoint } from "../utils/http";
import { type AuthLogin, AuthResponse, type AuthRegister } from "../types/auth";

export const loginUser = makeEndpoint<typeof AuthResponse, AuthLogin>({
    method: "post",
    path: "/api/login",
    response: AuthResponse,
});

export const registerUser = makeEndpoint<typeof AuthResponse, AuthRegister>({
    method: "post",
    path: "/api/register",
    response: AuthResponse,
});
