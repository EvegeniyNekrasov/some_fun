import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { listOfNavLinks } from "./links";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
    const location = useRouterState({ select: (s) => s.location });

    const auth = useAuth();
    const navigate = useNavigate({ from: location.pathname });

    const hadleLogut = () => {
        auth.logout();
        navigate({ to: "/login" });
    };

    return (
        <div className="flex flex-col gap-2 w-full h-full p-4">
            <span>Tickets app</span>
            {listOfNavLinks.map(({ path, name, icon: Icon }) => {
                const isActive = location.pathname === path;
                const activeStyle = isActive ? "bg-zinc-800" : "";

                return (
                    <Link
                        className={`px-4 py-2 rounded hover:bg-zinc-600 
                            flex items-center gap-2 ${activeStyle}`}
                        key={path}
                        to={path}>
                        {Icon && <Icon className="w-4 h-4" />}
                        {name}
                    </Link>
                );
            })}
            <button
                onClick={hadleLogut}
                className="mt-auto p-2 bg-zinc-800 rounded">
                logout
            </button>
        </div>
    );
}
