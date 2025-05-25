import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface BreadcrumbsItem<TParams = Record<string, unknown>> {
    to: string;
    params?: TParams;
    label: ReactNode;
}

export interface BreadcrumbsProps {
    items: BreadcrumbsItem[];
    showHome?: boolean;
    className?: string;
}

export default function Breadcrumbs({
    items,
    showHome = true,
    className,
}: BreadcrumbsProps) {
    const crumbs = showHome
        ? [{ to: "/", label: "Home" } as BreadcrumbsItem].concat(items)
        : items;

    if (!crumbs.length) return null;

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-sm leading-none ${className ?? ""}`}>
            {crumbs.map((c, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                    <span
                        key={i}
                        className="flex items-center gap-2">
                        {i !== 0 && (
                            <ChevronRight className="h-4 w-4 stroke-1" />
                        )}
                        {isLast ? (
                            <span className="text-muted-foreground">
                                {c.label}
                            </span>
                        ) : (
                            <Link
                                to={c.to}
                                params={c.params}
                                className="hover:underline hover:text-amber-500 text-primary">
                                {c.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
