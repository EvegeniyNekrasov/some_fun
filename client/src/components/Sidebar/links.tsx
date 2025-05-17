import { Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavigationLink = {
    path: string;
    name: string;
    icon?: LucideIcon;
    summary?: number;
};

export const listOfNavLinks: NavigationLink[] = [
    { path: "/", name: "Dashboar", icon: Home },
    { path: "/about", name: "About", icon: Home },
];
