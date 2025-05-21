import { UsersListSchema } from "../types/users";
import { makeEndpoint } from "../utils/http";

export const listUsers = makeEndpoint<typeof UsersListSchema>({
    method: "get",
    path: "/api/users",
    response: UsersListSchema,
});
