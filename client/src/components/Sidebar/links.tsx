import { LayoutDashboard, SquareKanban, BadgeInfo } from "lucide-react";

import type { LucideIcon } from "lucide-react";

type NavigationLink = {
    path: string;
    name: string;
    icon?: LucideIcon;
    summary?: number;
};

export const listOfNavLinks: NavigationLink[] = [
    { path: "/", name: "Home", icon: LayoutDashboard },
    { path: "/about", name: "About", icon: BadgeInfo },
    { path: "/projects", name: "Projects", icon: SquareKanban },
];
