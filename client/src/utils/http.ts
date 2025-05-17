import { z } from "zod";
import { http } from "../ky";

type Method = "get" | "post";

export function makeEndpoint<
    TSchema extends z.ZodTypeAny,
    TParams extends Record<string, unknown> | void = void,
>(cfg: {
    method: Method;
    path: string | ((p: NonNullable<TParams>) => string);
    response: TSchema;
}) {
    return async (params?: TParams): Promise<z.infer<TSchema>> => {
        const url =
            typeof cfg.path === "function"
                ? cfg.path(params as NonNullable<TParams>)
                : cfg.path;
        const token = localStorage.getItem("myapp.auth.token");

        const res = await http[cfg.method](url, {
            json: params && cfg.method !== "get" ? params : undefined,
            searchParams:
                params && cfg.method !== "get"
                    ? new URLSearchParams(params as Record<string, string>)
                    : undefined,
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }).json<unknown>();

        return cfg.response.parse(res);
    };
}
