import { makeEndpoint } from "@/utils/http";
import { AuthLogin, AuthResponse } from "@/types/auth";

export const loginUser = makeEndpoint<typeof AuthResponse, AuthLogin>({
    method: "post",
    path: "/api/login",
    response: AuthResponse,
});
