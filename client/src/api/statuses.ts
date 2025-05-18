import { StatusesListSchema } from "../types/statuses";
import { makeEndpoint } from "../utils/http";

export const statusesList = makeEndpoint<typeof StatusesListSchema>({
    method: "get",
    path: "/api/statuses",
    response: StatusesListSchema,
});
