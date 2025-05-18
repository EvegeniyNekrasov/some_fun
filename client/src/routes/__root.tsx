import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: () => (
        <div className="bg-zinc-800 text-white w-full h-screen">
            <Outlet />,
        </div>
    ),
});
