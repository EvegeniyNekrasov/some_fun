import { z } from "zod";
import { http } from "../ky";

type Method = "get" | "post" | "put" | "delete" | "patch";

export function makeEndpoint<
    TResponseSchema extends z.ZodTypeAny,
    TPathParams extends Record<string, unknown> | void = void,
    TQueryParams extends Record<string, unknown> | void = void,
    TBody = void,
>(cfg: {
    method: Method;
    path: string | ((p: NonNullable<TPathParams>) => string);
    response: TResponseSchema;
}) {
    return async (args?: {
        path?: TPathParams;
        query?: TQueryParams;
        body?: TBody;
    }): Promise<z.infer<TResponseSchema>> => {
        const url =
            typeof cfg.path === "function"
                ? cfg.path((args?.path ?? {}) as NonNullable<TPathParams>)
                : cfg.path;

        const token = localStorage.getItem("myapp.auth.token");
        const res = await http[cfg.method](url, {
            json:
                cfg.method !== "get" && args?.body
                    ? args.body?.data
                    : undefined,
            searchParams: args?.query
                ? new URLSearchParams(args.query as Record<string, string>)
                : undefined,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }).json<unknown>();

        return cfg.response.parse(res);
    };
}
