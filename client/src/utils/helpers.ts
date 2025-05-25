import {
    ChevronDown,
    ChevronsUp,
    ChevronUp,
    type LucideIcon,
} from "lucide-react";

type Status = {
    value: number;
    label: string;
};

type Priority = {
    value: string;
    label: string;
    icon: LucideIcon;
};

export const priorityList: Priority[] = [
    { value: "low", label: "Low", icon: ChevronDown },
    { value: "medium", label: "Medium", icon: ChevronUp },
    { value: "high", label: "High", icon: ChevronsUp },
] as const;

export const statusList: Status[] = [
    { value: 1, label: "Todo" },
    { value: 2, label: "In Progress" },
    { value: 3, label: "Done" },
] as const;

export function makeAbbreviation(names: string): string {
    const trimmed = names.trim();

    if (trimmed === "") return "";

    const parts = trimmed.split(/[ \t-]+/);

    const initials = parts
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase())
        .join("");

    return initials;
}
