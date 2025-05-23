import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { listOfNavLinks } from "./links";
import { useAuth } from "../../context/AuthContext";
import AppVersion from "@/components/AppVersion";

export default function Sidebar() {
    useMatchRoute();

    const navigate = useNavigate();
    const { logout } = useAuth();

    const hadleLogut = () => {
        logout();
        navigate({ to: "/login" });
    };

    const linkStyle = `flex items-center gap-2 px-4 py-2 rounded 
        hover:bg-zinc-600 [&.active]:bg-zinc-700`;

    return (
        <aside
            className="flex flex-col gap-2 w-full h-full p-4 border-r-1
                         border-r-zinc-900">
            <span className="text-lg font-semibold">Tickets app</span>
            <AppVersion />

            <nav>
                <ul>
                    {listOfNavLinks.map(({ path, name, icon: Icon }) => (
                        <li key={path}>
                            <Link
                                to={path}
                                className={linkStyle}
                                preload="intent">
                                {Icon && <Icon className="w-4 h-4" />}
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <button
                onClick={hadleLogut}
                className="mt-auto p-2 bg-zinc-800 rounded">
                logout
            </button>
        </aside>
    );
}
