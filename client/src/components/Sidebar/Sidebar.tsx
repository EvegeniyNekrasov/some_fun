import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import AppVersion from "@/components/AppVersion";
import { Button } from "@/ui/button/Button";
import { listOfNavLinks } from "./links";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(() => {
        const value = localStorage.getItem("sidebar:collapsed");
        return value === "true";
    });

    useEffect(() => {
        localStorage.setItem("sidebar:collapsed", String(collapsed));
    }, [collapsed]);

    const toggle = useCallback(() => setCollapsed((c) => !c), []);

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate({ to: "/login" });
    };

    const baseLinkStyle =
        "flex items-center gap-2 rounded px-4 py-2 hover:bg-zinc-600 [&.active]:bg-zinc-700 transition-colors";

    return (
        <aside
            className={
                `flex flex-col h-full border-r border-r-zinc-900 p-4 gap-2
                     transition-all duration-300 overflow-hidden ` +
                (collapsed ? "w-18" : "w-60")
            }>
            <div className="flex items-center justify-between">
                {!collapsed ? <span>Ticketing app</span> : null}
                <Button
                    size="icon"
                    variant="ghost"
                    className="self-end mb-2"
                    onClick={toggle}
                    aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}>
                    {collapsed ? (
                        <ChevronsRight size={20} />
                    ) : (
                        <ChevronsLeft size={20} />
                    )}
                </Button>
            </div>

            <nav className="mt-2">
                <ul className="flex flex-col gap-1">
                    {listOfNavLinks.map(({ path, name, icon: Icon }) => (
                        <li key={path}>
                            <Link
                                to={path}
                                preload="intent"
                                className={
                                    baseLinkStyle +
                                    (collapsed ? " justify-center px-3" : "")
                                }>
                                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                                {!collapsed && <span>{name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto flex flex-col gap-2">
                {!collapsed ? (
                    <>
                        <div className="w-full h-0.5 bg-zinc-700" />
                        <AppVersion />
                    </>
                ) : null}
                <Button
                    variant="outline"
                    className={
                        "mt-auto " + (collapsed ? "justify-center p-3" : "")
                    }
                    onClick={handleLogout}>
                    <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        {!collapsed && <span>Logout</span>}
                    </div>
                </Button>
            </div>
        </aside>
    );
}
