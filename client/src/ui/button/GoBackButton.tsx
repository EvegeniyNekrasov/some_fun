import {
    Link,
    type RegisteredRouter,
    type ValidateLinkOptions,
} from "@tanstack/react-router";

import { ChevronLeft } from "lucide-react";

interface GoBackButtonProps<
    TRouter extends RegisteredRouter = RegisteredRouter,
    TOptions = unknown,
> {
    linkOptions: ValidateLinkOptions<TRouter, TOptions>;
    label?: string;
}
export default function GoBackButton<
    TRouter extends RegisteredRouter = RegisteredRouter,
    TOptions = unknown,
>({
    linkOptions,
    label = "Go to previous page",
}: GoBackButtonProps<TRouter, TOptions>) {
    return (
        <Link
            className="flex items-center gap-2 min-w-[150px] hover:text-amber-500"
            {...linkOptions}>
            <ChevronLeft />
            <span>{label}</span>
        </Link>
    );
}
